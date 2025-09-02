import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/services/usersService'
import { User, UserFormData } from '@/types/user'
import { useActivityLogStore } from '@/stores/activityLogStore'
import { ITEMS_PER_PAGE } from '@/utils/constants'

export const useUsers = (page: number = 1) => {
  const queryClient = useQueryClient()
  const addLog = useActivityLogStore((state) => state.addLog)

  const {
    data: users = [],
    isLoading: usersLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: ['users', page],
    queryFn: async () => {
      const allUsers = await usersService.getUsers()
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      return allUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    },
  })

  const { data: allUsers = [], isLoading: allUsersLoading } = useQuery<User[], Error>({
    queryKey: ['all-users'],
    queryFn: usersService.getUsers,
  })

  const createUserMutation = useMutation<User, Error, UserFormData, { previousUsers?: User[] }>(
    {
      mutationFn: (userData: UserFormData) => usersService.createUser(userData),
      onMutate: async (newUser) => {
        await queryClient.cancelQueries({ queryKey: ['users', page] })
        await queryClient.cancelQueries({ queryKey: ['all-users'] })

        const previousUsers = queryClient.getQueryData<User[]>(['users', page])
        const previousAllUsers = queryClient.getQueryData<User[]>(['all-users'])

        const optimisticUser: User = {
          id: Date.now(),
          ...newUser,
          username: newUser.name.toLowerCase().replace(/\s+/g, ''),
          address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: { lat: '', lng: '' },
          },
          website: '',
          company: {
            name: newUser.company,
            catchPhrase: '',
            bs: '',
          },
        }

        queryClient.setQueryData<User[]>(['users', page], (old = []) => [optimisticUser, ...old])
        queryClient.setQueryData<User[]>(['all-users'], (old = []) => [optimisticUser, ...old])

        addLog('CREATE', newUser)

        return { previousUsers: previousUsers ?? previousAllUsers }
      },
      onError: (err, newUser, context) => {
        queryClient.setQueryData(['users', page], context?.previousUsers)
      },
      onSuccess: (createdUser) => {
        queryClient.setQueryData<User[]>(['users', page], (old = []) => [createdUser, ...old.filter(u => u.id !== createdUser.id)])
        queryClient.setQueryData<User[]>(['all-users'], (old = []) => [createdUser, ...old.filter(u => u.id !== createdUser.id)])
      },
    }
  )

  const updateUserMutation = useMutation<User, Error, { id: number; userData: UserFormData }, { previousUsers?: User[] }>(
    {
      mutationFn: ({ id, userData }: { id: number; userData: UserFormData }) =>
        usersService.updateUser(id, userData),
      onMutate: async ({ id, userData }) => {
        await queryClient.cancelQueries({ queryKey: ['users', page] })
        await queryClient.cancelQueries({ queryKey: ['all-users'] })

        const previousUsers = queryClient.getQueryData<User[]>(['users', page])
        const previousAllUsers = queryClient.getQueryData<User[]>(['all-users'])

        queryClient.setQueryData<User[]>(['users', page], (old = []) =>
          old.map((user) =>
            user.id === id
              ? {
                  ...user,
                  ...userData,
                  company: { ...user.company, name: userData.company },
                }
              : user
          )
        )

        queryClient.setQueryData<User[]>(['all-users'], (old = []) =>
          old.map((user) =>
            user.id === id
              ? {
                  ...user,
                  ...userData,
                  company: { ...user.company, name: userData.company },
                }
              : user
          )
        )

        addLog('UPDATE', userData)

        return { previousUsers: previousUsers ?? previousAllUsers }
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(['users', page], context?.previousUsers)
      },
      onSuccess: (updatedUser) => {
        queryClient.setQueryData<User[]>(['users', page], (old = []) =>
          old.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        )
        queryClient.setQueryData<User[]>(['all-users'], (old = []) =>
          old.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        )
      },
    }
  )

  const deleteUserMutation = useMutation<void, Error, number, { previousUsers?: User[] }>(
    {
      mutationFn: (id: number) => usersService.deleteUser(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['users', page] })
        await queryClient.cancelQueries({ queryKey: ['all-users'] })

        const previousUsers = queryClient.getQueryData<User[]>(['users', page])
        const previousAllUsers = queryClient.getQueryData<User[]>(['all-users'])

        queryClient.setQueryData<User[]>(['users', page], (old = []) =>
          old.filter((user) => user.id !== id)
        )

        queryClient.setQueryData<User[]>(['all-users'], (old = []) =>
          old.filter((user) => user.id !== id)
        )

        const deletedUser = previousAllUsers?.find((user) => user.id === id)
        if (deletedUser) {
          addLog('DELETE', deletedUser)
        }

        return { previousUsers: previousUsers ?? previousAllUsers }
      },
      onError: (err, id, context) => {
        queryClient.setQueryData(['users', page], context?.previousUsers)
      },
      onSuccess: (_data, id) => {
        queryClient.setQueryData<User[]>(['users', page], (old = []) => old.filter((u) => u.id !== id))
        queryClient.setQueryData<User[]>(['all-users'], (old = []) => old.filter((u) => u.id !== id))
      },
    }
  )

  const isLoading = usersLoading || allUsersLoading;

  return {
    users,
    allUsers,
    isLoading,
    error,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
  isCreating: createUserMutation.status === 'pending',
  isUpdating: updateUserMutation.status === 'pending',
  isDeleting: deleteUserMutation.status === 'pending',
  }
}
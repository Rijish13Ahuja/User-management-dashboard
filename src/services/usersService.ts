import axios from 'axios'
import { User, UserFormData } from '@/types/user'
import { API_BASE_URL } from '@/utils/constants'

const client = axios.create({
  baseURL: API_BASE_URL,
})

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await client.get<User[]>('/users')
    return response.data
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await client.get<User>(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: UserFormData): Promise<User> => {
    const tempUser = {
      id: Date.now(), 
      ...userData,
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: { lat: '', lng: '' },
      },
      website: '',
      company: {
        name: userData.company,
        catchPhrase: '',
        bs: '',
      },
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tempUser as User)
      }, 500)
    })
  },
  updateUser: async (id: number, userData: UserFormData): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          ...userData,
          username: userData.name.toLowerCase().replace(/\s+/g, ''),
          address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: { lat: '', lng: '' },
          },
          website: '',
          company: {
            name: userData.company,
            catchPhrase: '',
            bs: '',
          },
        } as User)
      }, 500)
    })
  },
  deleteUser: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  },
}
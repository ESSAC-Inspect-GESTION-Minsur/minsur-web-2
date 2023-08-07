import { StatusCodes } from 'http-status-codes'
import { AppServices } from '@/shared/service/api.service'
import { type User, type UserLogin, type UserToStorage } from '@/users/models/user.interface'
import { type UserResponse } from '@/users/models/response/user.response'
import { AuthStore } from './auth.store'

export class AuthServices extends AppServices {
  storeService: AuthStore
  constructor () {
    super({ baseUrl: 'auth', contentType: 'application/json' })
    this.storeService = new AuthStore()
  }

  changePassword = async (password: string, userId: string): Promise<User> => {
    return await this.patch<User>(`/${userId}/change-password`, { password })
      .then(response => response.data)
  }

  login = async (userLogin: UserLogin): Promise<User | null | undefined> => {
    return await this.post<UserResponse>('/login', userLogin)
      .then(response => {
        if (response.status === StatusCodes.CREATED) {
          const { tokens, authenticatedUser } = response.data
          const { id, username, role } = authenticatedUser

          const userStorage: UserToStorage = {
            id,
            username,
            role
          }

          this.storeService.saveToken(tokens.accessToken)
          this.storeService.saveUser(userStorage)

          return authenticatedUser
        }
      })
  }

  logout = (): void => {
    this.storeService.removeToken()
    this.storeService.removeUser()
  }
}

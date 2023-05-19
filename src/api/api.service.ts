import { Inject, Injectable } from '@nestjs/common'
import { API_MODULE_OPTIONS, apiAuthCacheData } from './api.constants'
import { IApiAuthData, IApiData, IApiOptions } from './api.interfaces'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class ApiService {
  constructor(
    @Inject(API_MODULE_OPTIONS) private readonly options: IApiOptions,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async getAuthData(): Promise<IApiAuthData> {
    const { username, host, password } = this.options
    const res = await fetch(`${host}/api/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('API auth error.')
    const { data } = await res.json()
    return data
  }

  async getToken(): Promise<string> {
    const oldAuthData = await this.cache.get<IApiAuthData | undefined>(apiAuthCacheData)
    if (!oldAuthData) {
      const newAuthData = await this.getAuthData()
      await this.cache.set(apiAuthCacheData, newAuthData, 86400 * 1000)
      return newAuthData?.access_token
    }
    return oldAuthData?.access_token
  }

  async getProduct(code: string): Promise<IApiData | undefined> {
    const authToken = await this.getToken()
    const res = await fetch(`${this.options.host}/api/reklamy/get-product?code=${code}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    if (res.ok) {
      return await res.json()
    } else {
      return
    }
  }
}

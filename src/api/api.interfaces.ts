import { ModuleMetadata } from '@nestjs/common'

export interface IApiOptions {
  host: string
  username: string
  password: string
}

export interface IApiModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IApiOptions> | IApiOptions
  inject?: any[]
}

export interface IApiData {
  data: {
    uz: IProductData
    ru: IProductData
  }
}

export interface IProductData {
  name: string
  description: string
  url: string
  poster_url: string
  poster_thumb_url: string
}

export interface IApiAuthData {
  success: boolean
  access_token: string
  token_type: string
  expires_in: number
}

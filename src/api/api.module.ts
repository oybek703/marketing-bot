import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { IApiModuleAsyncOptions } from './api.interfaces'
import { ApiService } from './api.service'
import { API_MODULE_OPTIONS } from './api.constants'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { getCacheConfig } from '../configs/cache.config'

@Global()
@Module({
  imports: [
    CacheModule.register({
      inject: [ConfigService],
      useFactory: getCacheConfig
    })
  ]
})
export class ApiModule {
  static forRootAsync(options: IApiModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options)
    return {
      module: ApiModule,
      imports: options.imports,
      providers: [ApiService, asyncOptions],
      exports: [ApiService]
    }
  }

  private static createAsyncOptionsProvider(options: IApiModuleAsyncOptions): Provider {
    return {
      provide: API_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => options.useFactory(...args),
      inject: options.inject || []
    }
  }
}

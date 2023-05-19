import { ConfigService } from '@nestjs/config'
import { EnvVariables } from '../common/constants'
import { IApiOptions } from '../api/api.interfaces'

export const getApiConfig = (configService: ConfigService): IApiOptions => {
  const apiHost = configService.get(EnvVariables.apiHost)
  const apiAuthUsername = configService.get(EnvVariables.apiAuthUsername)
  const apiAuthPassword = configService.get(EnvVariables.apiAuthPassword)
  if (!apiHost || !apiAuthUsername || !apiAuthPassword) {
    throw new Error('Error while connecting to API.')
  }
  return {
    host: apiHost,
    username: apiAuthUsername,
    password: apiAuthPassword
  }
}

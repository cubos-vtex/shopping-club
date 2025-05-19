import type { RecorderState, ServiceContext } from '@vtex/api'

import type { Clients } from './clients'
import type {
  AppSettingsController,
  SessionMasterdataController,
  UserMasterdataController,
} from './controllers'

declare global {
  type Context = ServiceContext<
    Clients,
    RecorderState & {
      storeUserEmail?: string
      appSettingsController: AppSettingsController
      userMasterdataController: UserMasterdataController
      sessionMasterdataController: SessionMasterdataController
    }
  >

  type NextFn = () => Promise<void>

  type Handler = (ctx: Context, next?: NextFn) => Promise<void>

  type AppSettings = { schemaHash: string }

  type MasterdataInternalFields = {
    id: string
    createdIn: string
    lastInteractionIn: string
  }

  type User = MasterdataInternalFields & {
    code: string
    name: string
    email: string
    password: string
  }

  type Session = MasterdataInternalFields & {
    email: string
    expiration: number
  }
}

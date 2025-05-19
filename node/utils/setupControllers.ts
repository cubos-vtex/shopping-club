import {
  AppSettingsController,
  SessionMasterdataController,
  UserMasterdataController,
} from '../controllers'

export async function setupControllers(ctx: Context, next?: NextFn) {
  ctx.state = {
    ...ctx.state,
    appSettingsController: new AppSettingsController(ctx),
    userMasterdataController: new UserMasterdataController(ctx),
    sessionMasterdataController: new SessionMasterdataController(ctx),
  }

  await next?.()
}

import { method } from '@vtex/api'

import { createMasterdataHandlers } from '../utils'

async function login(ctx: Context) {
  ctx.body = await ctx.state.sessionMasterdataController.login()
}

async function getSession(ctx: Context) {
  ctx.body = await ctx.state.sessionMasterdataController.get()
}

export default method({
  POST: createMasterdataHandlers([login]),
  GET: createMasterdataHandlers([getSession]),
})

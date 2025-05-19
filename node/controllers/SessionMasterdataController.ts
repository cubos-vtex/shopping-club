import { SESSION_ENTITY, SESSION_FIELDS } from '../masterdata-setup'
import { throwAuthenticationError } from '../utils'
import { BaseMasterdataController } from './base/BaseMasterdataController'

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000

export class SessionMasterdataController extends BaseMasterdataController<Session> {
  constructor(ctx: Context) {
    super(ctx, SESSION_ENTITY, SESSION_FIELDS)
  }

  public async login() {
    const user = await this.ctx.state.userMasterdataController
      .getByEmailAndPassword()
      .catch(throwAuthenticationError)

    const searchExistingSession = await this.searchDocumentsWithPaginationInfo(
      { page: 1, pageSize: 1 },
      `email="${user.email}"`
    )

    const [existingSession] = searchExistingSession.data

    if (existingSession) {
      if (existingSession.expiration > Date.now()) {
        const newSession = {
          ...existingSession,
          expiration: Date.now() + ONE_DAY_IN_MS,
        }

        await this.updatePartialDocument(existingSession.id, newSession)
        this.ctx.set('club-session', newSession.id)

        return { ...newSession, user }
      }

      this.deleteDocument(existingSession.id)
    }

    const newSession = await this.createDocument({
      expiration: Date.now() + ONE_DAY_IN_MS,
      email: user.email,
    })

    this.ctx.set('club-session', newSession.id)

    return { ...newSession, user }
  }

  public async get() {
    const clubSession = this.ctx.get('club-session')

    if (!clubSession) {
      throwAuthenticationError()
    }

    const session = await this.getDocument(clubSession).catch(
      throwAuthenticationError
    )

    if (session.expiration <= Date.now()) {
      this.deleteDocument(session.id)
      throwAuthenticationError()
    }

    const {
      password,
      ...user
    } = await this.ctx.state.userMasterdataController
      .getByEmail(session.email)
      .catch(throwAuthenticationError)

    return { ...session, user }
  }
}

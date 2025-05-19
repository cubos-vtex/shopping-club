import { SCHEMAS, USER_ENTITY, USER_FIELDS } from '../masterdata-setup'
import { BaseMasterdataController } from './base/BaseMasterdataController'

export class UserMasterdataController extends BaseMasterdataController<User> {
  constructor(ctx: Context) {
    super(ctx, USER_ENTITY, USER_FIELDS)
  }

  private async getUserFields(requiredFields?: string[]) {
    return this.getBodyFields<User>(requiredFields)
  }

  private getIdParam() {
    return this.getPathParam('id')
  }

  public async get() {
    const id = this.getIdParam()

    return this.getDocument(id)
  }

  public async create() {
    const fields = await this.getUserFields(SCHEMAS.user.body.required)

    return this.createDocument(fields)
  }

  public async update() {
    const user = await this.get()
    const fields = await this.getUserFields()
    const newFields = { ...user, ...fields }

    await this.updatePartialDocument(user.id, newFields)

    return newFields
  }

  public async delete() {
    const toBeDeleted = await this.get()

    await this.deleteDocument(toBeDeleted.id)

    return toBeDeleted
  }

  public async search() {
    const {
      sort = 'createdIn desc',
      pagination,
    } = this.getMasterdataSearchQuery()

    const conditions: string[] = []
    const { search } = this.getQueryStringParams(['search'] as const)
    const searchWithWildcards = search
      ?.trim()
      ?.replace(/["*]/g, '')
      ?.split(/\s+/)
      .join('*')

    if (searchWithWildcards) {
      conditions.push(
        `(name="*${searchWithWildcards}*" OR email="*${searchWithWildcards}*")`
      )
    }

    const where = conditions.join(' AND ')

    return this.searchDocumentsWithPaginationInfo(pagination, where, sort)
  }

  public async getByEmailAndPassword() {
    const { email, password } = await this.getUserFields(['email', 'password'])

    return this.getFirstResult(`email="${email}" AND password="${password}"`)
  }

  public async getByEmail(email: string) {
    return this.getFirstResult(`email="${email}"`)
  }
}

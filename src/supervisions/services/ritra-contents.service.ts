import { AppServices } from '@/shared/service/api.service'
import { type RitraContentDto, type RitraContent } from '../models/ritra-content.interface'

export class RitraContentsService extends AppServices {
  constructor () {
    super({ baseUrl: 'ritra-contents', contentType: 'application/json' })
  }

  async findAll (): Promise<RitraContent[]> {
    return await this.get<RitraContent[]>('/')
      .then((response) => response.data)
  }

  async find (): Promise<RitraContent> {
    const id: string = import.meta.env.VITE_RITRA_CONTENT_ID ?? ''
    return await this.get<RitraContent>(`/${id}`)
      .then((response) => response.data)
  }

  async create (ritraContent: RitraContentDto): Promise<RitraContent> {
    return await this.post<RitraContent>('/', ritraContent)
      .then((response) => response.data)
  }

  async update (ritraContent: RitraContentDto): Promise<RitraContent> {
    const id: string = import.meta.env.VITE_RITRA_CONTENT_ID ?? ''
    return await this.patch<RitraContent>(`/${id}`, ritraContent)
      .then((response) => response.data)
  }

  async remove (id: string): Promise<RitraContent> {
    return await this.delete<RitraContent>(`/${id}`)
      .then((response) => response.data)
  }
}

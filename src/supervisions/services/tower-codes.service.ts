import { AppServices } from '@/shared/service/api.service'
import { type TowerCode, type TowerCodeDto } from '../models/tower-code.interface'

export class TowerCodesService extends AppServices {
  constructor () {
    super({ baseUrl: 'tower-codes', contentType: 'application/json' })
  }

  async findAll (): Promise<TowerCode[]> {
    return await this.get<TowerCode[]>('/')
      .then((response) => response.data)
  }

  async findById (id: string): Promise<TowerCode> {
    return await this.get<TowerCode>(`/${id}`)
      .then((response) => response.data)
  }

  async create (towerCode: TowerCodeDto): Promise<TowerCode> {
    return await this.post<TowerCode>('/', towerCode)
      .then((response) => response.data)
  }

  async update (towerCode: TowerCodeDto, id: string): Promise<TowerCode> {
    return await this.patch<TowerCode>(`/${id}`, towerCode)
      .then((response) => response.data)
  }

  async remove (id: string): Promise<TowerCode> {
    return await this.delete<TowerCode>(`/${id}`)
      .then((response) => response.data)
  }
}

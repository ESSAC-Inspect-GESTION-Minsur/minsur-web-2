import { AppServices } from '@/shared/service/api.service'
import { type WheelStatusDto, type WheelStatus } from '../models/wheel-status.interface'

export class WheelStatusService extends AppServices {
  constructor () {
    super({ baseUrl: 'wheel-status', contentType: 'application/json' })
  }

  async findAll (): Promise<WheelStatus[]> {
    return await this.get<WheelStatus[]>('')
      .then((response) => response.data)
  }

  async create (wheelStatusDto: WheelStatusDto): Promise<WheelStatus> {
    return await this.post<WheelStatus>('', wheelStatusDto)
      .then((response) => response.data)
  }

  async remove (id: string): Promise<WheelStatus> {
    return await this.delete<WheelStatus>(`/${id}`)
      .then((response) => response.data)
  }
}

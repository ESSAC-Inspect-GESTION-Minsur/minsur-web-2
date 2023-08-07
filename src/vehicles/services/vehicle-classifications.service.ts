import { AppServices } from '@/shared/service/api.service'
import { type VehicleClassification, type VehicleClassificationDto } from '../models/vehicle-classification.interface'

export class VehicleClassificationsService extends AppServices {
  constructor () {
    super({ baseUrl: 'vehicle-classifications', contentType: 'application/json' })
  }

  async findAll (): Promise<VehicleClassification[]> {
    return await this.get<VehicleClassification[]>('/')
      .then((response) => response.data)
  }

  async findById (id: string): Promise<VehicleClassification> {
    return await this.get<VehicleClassification>(`/${id}`)
      .then((response) => response.data)
  }

  async create (vehicleClassification: VehicleClassificationDto): Promise<VehicleClassification> {
    return await this.post<VehicleClassification>('/', vehicleClassification)
      .then((response) => response.data)
  }

  async update (vehicleClassification: VehicleClassificationDto, id: string): Promise<VehicleClassification> {
    return await this.patch<VehicleClassification>(`/${id}`, vehicleClassification)
      .then((response) => response.data)
  }

  async remove (id: string): Promise<VehicleClassification> {
    return await this.delete<VehicleClassification>(`/${id}`)
      .then((response) => response.data)
  }
}

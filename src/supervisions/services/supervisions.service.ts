import { type DateRange } from '@/shared/types/date-range'
import { AppServices } from '@/shared/service/api.service'
import { type Supervision } from '../models/supervision.interface'

export interface FindAllOptions {
  dateRange: DateRange
  profileId: string
}

export default class SupervisionsServices extends AppServices {
  constructor () {
    super({ baseUrl: 'supervisions', contentType: 'application/json' })
  }

  findAll = async ({ dateRange, profileId }: FindAllOptions): Promise<Supervision[]> => {
    const dateStart = dateRange.formattedDateStart()
    const dateEnd = dateRange.formattedDateEnd()
    return await this.get<Supervision[]>('', {
      params: {
        'date-start': dateStart,
        'date-end': dateEnd,
        'profile-id': profileId
      }
    })
      .then(response => {
        const supervisions = response.data
        createSupervisionStorage(supervisions, dateRange)
        return supervisions
      })
  }

  findById = async (id: string): Promise<Supervision> => {
    return await this.get<Supervision>(`/${id}`)
      .then(response => response.data)
  }
}

const createSupervisionStorage = (supervisions: Supervision[], dateRange: DateRange): void => {
  sessionStorage.setItem('supervisions-request', JSON.stringify({
    supervisions,
    dateRange: dateRange.toObject(),
    lastRequest: new Date()
  }))
}

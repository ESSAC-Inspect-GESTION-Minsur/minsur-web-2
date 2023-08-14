import Divider from '@/shared/ui/components/Divider'
import { isDate } from '@/shared/utils'
import { type License } from '@/users/models/types/license'
import moment from 'moment'
import React, { type ReactElement } from 'react'

interface LicenseDetailProps {
  license: License
  index: number
}

const LicenseDetail = ({ license, index }: LicenseDetailProps): ReactElement => {
  const formatLicenseExpiration = (): string => {
    const licenseExpiration = license.expiration ?? 'No registrado'
    if (!isDate(licenseExpiration)) return 'No registrado'

    return moment(licenseExpiration).format('DD/MM/YYYY')
  }

  return (
    <div className='my-2'>
      <p className='uppercase font-semibold text-base'>Licencia {index}</p>
      <Divider className='my-1'/>
      <p><span className='font-semibold uppercase'>Licencia:</span> {license.license ?? 'No registrado'}</p>
      <p><span className='font-semibold uppercase'>Categoría:</span> {license.category ?? 'No registrado'}</p>
      <p><span className='font-semibold uppercase'>Vencimiento Licencia:</span> {formatLicenseExpiration()}</p>
    </div>
  )
}

export default LicenseDetail

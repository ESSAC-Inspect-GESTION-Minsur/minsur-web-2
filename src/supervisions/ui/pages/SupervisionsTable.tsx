import React, { type ReactElement } from 'react'
import { type Supervision } from '@/supervisions/models/supervision.interface'
import Table from '@/shared/ui/components/table/Table'
import Button from '@/shared/ui/components/Button'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/shared/utils'
import { type Action, type Column } from '@/shared/ui/components/table/types'
import { goToGoogleMapsPage } from '@/supervisions/utils/map-utils'
import moment from 'moment'

interface SupervisionsTableProps {
  supervisions: Supervision[]
  showFilter: boolean
  setSupervisionsFiltered: (supervisions: Supervision[]) => void
}

const SupervisionsTable = ({ supervisions, showFilter, setSupervisionsFiltered }: SupervisionsTableProps): ReactElement => {
  const navigate = useNavigate()

  const ROUTE_COLUMNS: Array<Column<Supervision>> = [
    {
      id: 'code',
      columnName: 'Código Checklist',
      filterFunc: (supervision) => supervision.code,
      render: (supervision) => supervision.code,
      sortFunc: (a, b) => a.code > b.code ? 1 : -1
    },
    {
      id: 'createdAt',
      columnName: 'Fecha',
      filterFunc: (supervision) => formatDate(supervision.createdAt),
      render: (supervision) => formatDate(supervision.createdAt),
      sortFunc: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      id: 'inspector',
      columnName: 'Inspector',
      filterFunc: (supervision) => {
        const inspector = supervision.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'supervisor')?.profile

        if (!inspector) return 'N/A'

        return `${inspector.name} ${inspector.lastName}`
      },
      render: (supervision) => {
        const inspector = supervision.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'supervisor')?.profile

        if (!inspector) return 'N/A'

        return `${inspector.name} ${inspector.lastName}`
      }
    },
    {
      id: 'company',
      columnName: 'Empresa',
      filterFunc: (supervision) => supervision.vehicleDescription.company,
      render: (supervision) => supervision.vehicleDescription.company,
      sortFunc: (a, b) => a.vehicleDescription.company.localeCompare(b.vehicleDescription.company)
    },
    {
      id: 'contractor',
      columnName: 'Contratante',
      filterFunc: (supervision) => supervision.vehicleDescription.contractor,
      render: (supervision) => supervision.vehicleDescription.contractor,
      sortFunc: (a, b) => a.vehicleDescription.contractor.localeCompare(b.vehicleDescription.contractor)
    },
    {
      id: 'sponsor',
      columnName: 'Sponsor',
      filterFunc: (supervision) => supervision.vehicleDescription.sponsor,
      render: (supervision) => supervision.vehicleDescription.sponsor,
      sortFunc: (a, b) => a.vehicleDescription.sponsor.localeCompare(b.vehicleDescription.sponsor)
    },
    {
      id: 'vehicleClassification',
      columnName: 'Clasificación Vehicular',
      filterFunc: (supervision) => supervision.vehicleClassification,
      render: (supervision) => supervision.vehicleClassification,
      sortFunc: (a, b) => a.vehicleClassification.localeCompare(b.vehicleClassification)
    },
    {
      id: 'vehicleType',
      columnName: 'Tipo de Vehículo',
      filterFunc: (supervision) => supervision.vehicle.vehicleType.name,
      render: (supervision) => supervision.vehicle.vehicleType.name,
      sortFunc: (a, b) => a.vehicle.vehicleType.name.localeCompare(b.vehicle.vehicleType.name)
    },
    {
      id: 'licensePlate',
      columnName: 'Placa Tracto',
      filterFunc: (supervision) => {
        if (supervision.vehicle === null) return 'N/A'

        return supervision.vehicle.licensePlate
      },
      render: (supervision) => {
        if (supervision.vehicle === null) return 'N/A'

        return supervision.vehicle.licensePlate
      },
      sortFunc: (a, b) => {
        if (a.vehicle === null) return -1
        if (b.vehicle === null) return 1

        return a.vehicle.licensePlate.localeCompare(b.vehicle.licensePlate)
      }
    },
    {
      id: 'cartLicensePlate',
      columnName: 'Placa Carreta',
      filterFunc: (supervision) => {
        if (supervision.cart === null) return 'N/A'

        return supervision.cart.licensePlate
      },
      render: (supervision) => {
        if (supervision.cart === null) return 'N/A'

        return supervision.cart.licensePlate
      },
      sortFunc: (a, b) => {
        if (a.cart === null) return -1
        if (b.cart === null) return 1

        return a.cart.licensePlate.localeCompare(b.cart.licensePlate)
      }
    },
    {
      id: 'timeStart',
      columnName: 'Hora de ingreso',
      filterFunc: (supervision) => moment(supervision.timeStart).format('hh:mm A'),
      render: (supervision) => moment(supervision.timeStart).format('hh:mm A'),
      sortFunc: (a, b) => {
        const timeStartA = moment(a.timeStart).format('hh:mm A')
        const timeStartB = moment(b.timeStart).format('hh:mm A')

        return timeStartA.localeCompare(timeStartB)
      }
    },
    {
      id: 'timeEnd',
      columnName: 'Hora de salida',
      filterFunc: (supervision) => moment(supervision.timeEnd).format('hh:mm A'),
      render: (supervision) => moment(supervision.timeEnd).format('hh:mm A'),
      sortFunc: (a, b) => {
        const timeEndA = moment(a.timeEnd).format('hh:mm A')
        const timeEndB = moment(b.timeEnd).format('hh:mm A')

        return timeEndA.localeCompare(timeEndB)
      }
    },
    {
      id: 'isFull',
      columnName: '¿Va llena?',
      filterFunc: (supervision) => supervision.isFull ? 'Si' : 'No',
      render: (supervision) => supervision.isFull ? 'Si' : 'No',
      sortFunc: (a, b) => {
        const isFullA = a.isFull ? 'Sí' : 'No'
        const isFullB = a.isFull ? 'Sí' : 'No'

        return isFullA > isFullB ? 1 : -1
      }
    },
    {
      id: 'materialType',
      columnName: 'Tipo de carga',
      filterFunc: (supervision) => supervision.materialType ?? 'N/A',
      render: (supervision) => supervision.materialType ?? 'N/A',
      sortFunc: (a, b) => {
        const materialTypeA = a.materialType ?? 'N/A'
        const materialTypeB = b.materialType ?? 'N/A'

        return materialTypeA.localeCompare(materialTypeB)
      }
    },
    {
      id: 'driverName',
      columnName: 'Nombre del conductor',
      filterFunc: (supervision) => {
        const driver = supervision.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'driver')?.profile

        if (!driver) return 'N/A'

        return `${driver.name} ${driver.lastName}`
      },
      render: (supervision) => {
        const driver = supervision.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'driver')?.profile

        if (!driver) return 'N/A'

        return `${driver.name} ${driver.lastName}`
      },
      sortFunc: (a, b) => {
        const driverA = a.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'driver')?.profile
        const driverB = b.supervisionProfiles.find((profile) => profile.role.toLowerCase() === 'driver')?.profile

        if (!driverA) return -1
        if (!driverB) return 1

        return `${driverA.name} ${driverA.lastName}`.localeCompare(`${driverB.name} ${driverB.lastName}`)
      }
    },
    {
      id: 'location',
      columnName: 'Ubicación',
      filterFunc: (supervision) => supervision.location,
      render: (supervision) => {
        return (
          <p
            className='hover:text-red cursor-pointer'
            onClick={() => { goToGoogleMapsPage(supervision.location) }}
          >
          {supervision.location}
          </p>
        )
      },
      sortFunc: (a, b) => a.location.localeCompare(b.location)
    },
    {
      id: 'reportType',
      columnName: 'Tipo de reporte',
      filterFunc: (supervision) => supervision.template.name,
      render: (supervision) => supervision.template.name,
      sortFunc: (a, b) => a.template.name.localeCompare(b.template.name)
    }

  ]

  const PAGINATION = [5, 10, 15, 20]

  const onRowClick = (supervision: Supervision): void => {
    navigate(`/detalle-recorrido?id=${supervision.id}`)
  }

  const ROUTE_ACTIONS: Array<Action<Supervision>> = [
    {
      icon: () => (
        <Button color='primary'>Ver detalle</Button>
      ),
      actionFunc: onRowClick
    }
  ]

  return (
    <main>
      {
        supervisions.length > 0
          ? <Table setDataFiltered={setSupervisionsFiltered} columns={ROUTE_COLUMNS} data={supervisions} pagination={PAGINATION} showFilter={showFilter} actions={ROUTE_ACTIONS} />
          : <p className='text-center uppercase font-semibold text-red mt-10'>No hay recorridos en ese rango de fecha</p>
      }
    </main>
  )
}

export default SupervisionsTable

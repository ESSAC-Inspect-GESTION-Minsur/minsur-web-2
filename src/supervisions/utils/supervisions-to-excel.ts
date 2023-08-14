import { type Supervision } from '@/supervisions/models/supervision.interface'
import moment from 'moment'

const monthInSpanish = (month: number): string => {
  const months: Record<number, string> = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Setiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  }

  return months[month] ?? ''
}

export const supervisionsToExcel = (supervision: Supervision): Record<string, any> => {
  const {
    createdAt,
    materialType,
    code,
    message,
    isFull,
    vehicle,
    cart,
    supervisionProfiles,
    vehicleDescription,
    vehicleClassification,
    timeStart,
    timeEnd,
    checkpointGroups,
    fieldValues
  } = supervision

  const excelSupervision = {
    CÓDIGO: code,
    MES: monthInSpanish(moment(createdAt).month() + 1),
    SEMANA: `Semana ${moment(createdAt).week()}`,
    FECHA: moment(createdAt).format('DD/MM/YYYY'),
    'INSPECCIONADO POR': '',
    EMPRESA: vehicleDescription.company,
    CONTRATANTE: vehicleDescription.contractor,
    SPONSOR: vehicleDescription.sponsor,
    'CLASIFICACIÓN VEHICULAR': vehicleClassification,
    'TIPO DE VEHÍCULOS': vehicle.vehicleType.name,
    'PLACA TRACTO': vehicle.licensePlate,
    'PLACA CARRETA': cart?.licensePlate ?? 'N/A',
    'HORA INGRESO': moment(timeStart).format('HH:mm'),
    'HORA SALIDA': moment(timeEnd).format('HH:mm'),
    'TIEMPO DE INSPECCIÓN': moment(timeEnd).diff(moment(timeStart), 'minutes'),
    TRÁNSITO: '',
    'TIPO Y DETALLE DE CARGA': isFull ? 'VACÍO' : materialType,
    'NÚMERO DE PASAJEROS': '',
    'NOMBRES Y APELLIDOS DEL CONDUCTOR': '',
    'N° DE LICENCIA DE CONDUCIR': '',
    'CANTIDAD DE PRUEBAS DE ALCOTEST': '',

    OBSERVACIONES: '',
    'TIPO DE OBSERVACIONES': message,
    'ACCIÓN INMEDIATA': '', // ?
    'SEGUIMIENTO DE OBSERVACIONES': '', // ?
    'STATUS DE OBSERVACIONES': '',
    'FECHA DE LEVANTAMIENTO': '', // ?
    'ESTADO ACTUAL': ''
  }

  supervisionProfiles.forEach((profile) => {
    switch (profile.role) {
      case 'supervisor': {
        excelSupervision['INSPECCIONADO POR'] = profile.profile.fullName
        break
      }
      case 'conductor': {
        excelSupervision['NOMBRES Y APELLIDOS DEL CONDUCTOR'] = profile.profile.fullName
        excelSupervision['N° DE LICENCIA DE CONDUCIR'] = profile.profile.firstLicense?.license ?? 'N/A'
        break
      }
    }
  })

  excelSupervision['TRÁNSITO'] = checkpointGroups[0].type

  const alcotest = fieldValues.find((fieldValue) => fieldValue.fieldLabel.toLowerCase().includes('alcotest')) ?? null
  excelSupervision['CANTIDAD DE PRUEBAS DE ALCOTEST'] = alcotest?.value ?? 'N/A'

  const numberOfPassengers = fieldValues.find((fieldValue) => fieldValue.fieldLabel.toLowerCase().includes('pasajeros')) ?? null
  excelSupervision['NÚMERO DE PASAJEROS'] = numberOfPassengers?.value ?? 'N/A'

  const checkpoints = checkpointGroups[0].checkpoints
  const lastCheckpoint = checkpoints[checkpoints.length - 1]

  const observations = ''
  const statuses = ''

  lastCheckpoint.observations.forEach((observation, index) => {
    observations.concat(`${index + 1}. ${observation.message} \n`)
    statuses.concat(`${index + 1}. ${observation.status} \n`)
  })

  excelSupervision.OBSERVACIONES = observations
  excelSupervision['STATUS DE OBSERVACIONES'] = statuses

  return excelSupervision
}

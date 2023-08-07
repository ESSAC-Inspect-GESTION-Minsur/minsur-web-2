import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Checkpoint } from '@/checkpoints/models/checkpoint.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import { CheckpointGroupsService, CheckpointPDFServices } from '@/checkpoints/services/checkpoint-group.service'
import moment from 'moment'
import SupervisionsServices from '@/supervisions/services/supervisions.service'
import { type Supervision } from '@/supervisions/models/supervision.interface'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import ShowImageEvidence from '../components/ShowImageEvidence'
import { type Observation } from '@/checkpoints/models/observation.interface'

interface FieldSelected {
  url: string
  name: string
}

const CheckpointsView = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState<CheckpointGroup | null>(null)
  // const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [lastCheckpoint, setLastCheckpoint] = useState<Checkpoint | null>(null)

  const [supervision, setSupervision] = useState<Supervision | null>(null)

  const [fieldSelected, setFieldSelected] = useState<FieldSelected>({
    name: '',
    url: ''
  })

  const [showImage, setShowImage] = useState<boolean>(false)
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false)

  useEffect(() => {
    const supervisionId = searchParams.get('supervision-id')

    if (supervisionId === null) return

    const groupId = searchParams.get('group-id') ?? ''

    const checkpointGroupsService = new CheckpointGroupsService()
    void checkpointGroupsService.findAllBySupervisionId(supervisionId)
      .then((response) => {
        const group = response.find((group) => group.id === groupId)
        if (group === undefined) return

        setGroup(group)
        // setCheckpoints(group.checkpoints)

        const groupCheckpoints = group.checkpoints
        groupCheckpoints.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

        setLastCheckpoint(groupCheckpoints[groupCheckpoints.length - 1])
      })

    const supervisionsService = new SupervisionsServices()

    void supervisionsService.findById(supervisionId)
      .then((response) => {
        setSupervision(response)
      })
  }, [])

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  const driver = useMemo(() => {
    return supervision?.supervisionProfiles.find((supervisionProfile) => supervisionProfile.role.toUpperCase() === 'CONDUCTOR') ?? null
  }, [supervision])

  const supervisor = useMemo(() => {
    return supervision?.supervisionProfiles.find((supervisionProfile) => supervisionProfile.role.toUpperCase() === 'SUPERVISOR') ?? null
  }, [supervision])

  const exportPdf = (): void => {
    setIsPdfLoading(true)
    const checkpointPDFService = new CheckpointPDFServices()
    void checkpointPDFService.exportPdf(lastCheckpoint?.id ?? '', 'BAJADA', supervision?.code ?? '')
      .then(() => {
        setIsPdfLoading(false)
      })
  }

  const observations = useMemo(() => {
    const observations: Observation[] = []

    if (lastCheckpoint === null) return observations

    const fieldValues = supervision?.fieldValues ?? []

    lastCheckpoint?.observations.forEach((observation) => {
      const fieldValue = fieldValues.find((fieldValue) => fieldValue.fieldLabel.toLowerCase() === observation.fieldName.toLowerCase())

      if (fieldValue !== undefined) {
        observation.index = fieldValue.index
        observations.push(observation)
      }
    })

    observations.sort((a, b) => a.index - b.index)

    return observations
  }, [lastCheckpoint])

  return (
    <div className='container-page'>
      <div className='min-w-[600px] w-full'>
        <div className='flex justify-between items-end'>
          <p className='uppercase text-2xl font-semibold'>Supervisión {supervision?.code} - {group?.type}</p>
          <div className='flex gap-2'>
            <Button color='primary' onClick={exportPdf} isLoading={isPdfLoading}>Exportar PDF</Button>
            <Button color='secondary' onClick={() => { navigate(-1) }}>Volver</Button>
          </div>
        </div>
        <div className='h-[1px] bg-gray-400 w-full my-4'></div>

        <div className='border-[1px] border-b-0 border-black mx-auto h-full mb-10'>
          <div className='grid grid-cols-3 border-b border-black'>
            <div className='grid place-items-center border-r border-black'>
              <div className='p-5'>
                <img src="./logo-header.png" alt="" width={250} />
              </div>
            </div>
            <div className='flex flex-col border-r border-black'>
              <div className="grid place-items-center h-full">
                <p className='text-center uppercase font-bold text-lg'>Inspección de {supervision?.template.name}</p>
              </div>
            </div>
            <div className=''>
              <div className='h-1/2 border-b border-black'>
                <div className='h-full px-2 flex gap-2 items-center font-semibold'>
                  <p>Código:</p>
                  <p >{supervision?.code}</p>
                </div>
              </div>
              <div className='h-1/2'>
                <div className='h-full flex gap-2 px-2 items-center'>
                  <p className='text-sm'>Código de Autorización Torre de Control</p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 border-b border-black'>
            <div className='border-r border-black'>
              <p className='uppercase py-3 px-2 text-sm font-semibold text-end'>Combustible</p>
            </div>
            <div className='border-r border-black'>
              <p className='py-3 px-2 text-center'>{supervision?.fuel}</p>
            </div>
            <div className=''>
              <p className='py-3 px-2 text-sm font-semibold'>Guía de remisión</p>
            </div>
          </div>

          <div className='w-[100%] h-56 grid grid-cols-3 border-r text-sm [&>div>div>p]:py-1 [&>div>div]:flex [&>div>div]:gap-1 [&>div>div]:h-[25%] [&>div>div]:border-b [&>div>div]:border-black [&>div>div]:items-center [&>div>div]:overflow-hidden [&>div>div>p]:px-1 [&>div>div>p]:h-full'>
            <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Empresa:</p>
                <p className='w-[70%]'>{supervision?.vehicleDescription?.company}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Fecha:</p>
                <p className='w-[70%]'>{moment(supervision?.createdAt).format('DD/MM/YYYY')}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Tipo de Vehículo:</p>
                <p className='w-[70%]'>{supervision?.vehicle?.vehicleType.name}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Placa de vehículo:</p>
                <p className='w-[70%]'>{supervision?.vehicle?.licensePlate}</p>
              </div>
            </div>
            <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Hora de ingreso:</p>
                <p className='w-[70%]'>{moment(supervision?.timeStart).format('hh:mm A')}</p>
              </div>
              <div className=''>
                <p className='border-r border-black w-[30%] font-bold'>Contratante:</p>
                <p className='w-[70%]'>{supervision?.vehicleDescription?.contractor}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Marca:</p>
                <p className='w-[70%]'>{supervision?.vehicle?.brand}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Año de fabricación:</p>
                <p className='w-[70%]'>-</p>
              </div>
            </div>
            <div className='[&>div]:border-b [&>div]:border-black '>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Hora de salida:</p>
                <p className='w-[70%]'>{moment(supervision?.timeEnd).format('hh:mm A')}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-bold'>Tipo de Carga:</p>
                <p className='w-[70%]'>{supervision?.materialType !== null ? supervision?.materialType : '-'}</p>
              </div>
              <div>
              </div>
              <div>
              </div>
            </div>
          </div>

          <div className='border-b-[1px] border-black bg-blue-dark text-white font-bold'>
            <div className='flex'>
              <div className='w-[30%] grid items-center border-white'>
                <p className='px-2'>Campo</p>
              </div>
              <div className='w-[55%] grid items-center border-l-[1px] border-white'>
                <p className='px-2'>Observación</p>
              </div>
              <div className='w-[15%] flex flex-col gap-2 border-l-[1px] border-white'>
                <p className='text-center'>Pendiente</p>
                <div className='flex text-center border-t-[1px] border-white'>
                  <p className='w-[50%]'>si</p>
                  <p className='w-[50%] border-l-[1px] border-white'>no</p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            {
              observations.length === 0 && (
                <div className='flex border-b border-black'>
                  <div className='w-[30%]'>
                    <div className='flex items-center gap-3 justify-between'>
                      <p className='py-1 px-2 font-semibold uppercase'>Observaciones</p>
                    </div>
                  </div>
                  <div className='w-[55%] border-l-[1px] border-black'>
                    <div className='py-1 px-1 flex justify-between items-center'>
                      <p className='py-1 px-2 font-semibold uppercase'>En la inspección de bajada, el inspector no evidenció ninguna observación a la unidad</p>
                    </div>
                  </div>

                  <div className='w-[15%] border-l border-black'>
                    <div className='grid grid-cols-2 text-center h-full'>
                      <p className='self-center'></p>
                      <div className='border-l border-black flex justify-center'>
                        <p className='self-center'>X</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            {
              observations.map(observation => {
                return (
                  <div key={observation.id} className='flex border-b border-black'>
                    <div className='w-[5%]'>
                      <div className='h-full text-center border-r border-black grid place-items-center bg-blue-dark text-white font-bold'>
                        <p className='py-3'>{observation.index}</p>
                      </div>
                    </div>
                    <div className='w-[25%]'>
                      <div className='flex items-center gap-3 justify-between'>
                        <p className='py-1 px-2 font-semibold'>{observation.fieldName}</p>
                      </div>
                    </div>
                    <div className='w-[55%] border-l-[1px] border-black'>
                      <div className='py-1 px-1 flex justify-between items-center'>
                        <p className='py-1 px-2 font-semibold '>{observation.message}</p>
                        <div className='w-[10%] flex justify-center'>
                          {observation.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(observation.imageEvidence, observation.fieldName) }}></EyeIcon>}
                        </div>
                      </div>
                    </div>

                    <div className='w-[15%] border-l border-black'>
                      <div className='grid grid-cols-2 text-center h-full'>
                        <p className='self-center'>{observation.status.toUpperCase() === 'PENDIENTE' && 'x'}</p>
                        <div className='border-l border-black flex justify-center'>
                          <p className='self-center'>{observation.status.toUpperCase() === 'LEVANTADO' && 'x'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className='grid grid-cols-2 text-center border-b border-black'>
            <div className='border-r border-black'>
              <div className='border-b border-black bg-blue-dark text-white py-2'>
                <p>INSPECCIONADO POR CONDUCTOR</p>
              </div>
              <div className='py-2 flex flex-col justify-center border-b border-black'>
                <p>Nombre y apellido</p>
                <p className='font-bold'>{driver?.profile.fullName}</p>
              </div>
              <div className='text-start p-2 border-b border-black'>
                <p className='font-bold'>Nº licencia: <span className='font-normal'>{driver?.profile.license}</span></p>
              </div>
              <div className='text-start p-2'>
                <p className='font-bold'>Firma</p>
              </div>
            </div>
            <div>
              <div className='border-b border-black bg-blue-dark text-white py-2'>
                <p>INSPECCIONADO POR SUPERVISOR</p>
              </div>
              <div className='py-2 flex flex-col justify-center border-b border-black'>
                <p>Nombre y apellido</p>
                <p className='font-bold'>{supervisor?.profile.fullName}</p>
              </div>
              <div className='text-start p-2'>
                <p className='font-bold'>Firma</p>
              </div>
            </div>
          </div>

          <div className='border-b border-black'>
            <p className='px-2 py-3 italic font-semibold'>Nota:La verificación del documento y su validación se asume con las respectivas firmas del presente documento  (trabajador y supervisor )</p>
          </div>
        </div>
      </div>

      {showImage && <ShowImageEvidence isOpen={showImage} imageUrl={fieldSelected.url} name={fieldSelected.name} onClose={() => { setShowImage(false) }} />}
    </div>

  )
}

export default CheckpointsView

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { type ReactElement, useEffect, useState, useMemo, Fragment } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'

import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'

import SupervisionsServices from '@/supervisions/services/supervisions.service'
import { SUPERVISION_INITIAL_STATE, type Supervision } from '@/supervisions/models/supervision.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import ShowImageEvidence from '@/checkpoints/ui/components/ShowImageEvidence'
import { type FieldValue } from '@/supervisions/types/field-value'
import { SupervisionPDFServices } from '@/supervisions/services/pdf.service'
import { type RitraContent } from '@/supervisions/models/ritra-content.interface'
import { RitraContentsService } from '@/supervisions/services/ritra-contents.service'

interface FieldSelected {
  url: string
  name: string
}

interface SupervisionDetailProps {
  isPreviewPage?: boolean
}

const SupervisionDetail = ({ isPreviewPage = false }: SupervisionDetailProps): ReactElement => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [supervision, setSupervision] = useState<Supervision>(SUPERVISION_INITIAL_STATE)
  const [fieldValues, setFieldValues] = useState<Map<string, FieldValue[]>>(new Map<string, FieldValue[]>())
  const [fieldSelected, setFieldSelected] = useState<FieldSelected>({
    name: '',
    url: ''
  })

  const [showImage, setShowImage] = useState<boolean>(false)
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false)

  const [ritraContent, setRitraContent] = useState<RitraContent>({
    id: '',
    content: ''
  })

  useEffect(() => {
    const id = searchParams.get('id') ?? 0
    if (id === 0) return

    const supervisionsService = new SupervisionsServices()
    void supervisionsService.findById(id)
      .then(supervision => {
        setSupervision(supervision)
        groupFieldValues(supervision.fieldValues)
      })

    const ritraContentService = new RitraContentsService()
    void ritraContentService.find()
      .then(setRitraContent)
  }, [])

  const groupFieldValues = (fieldValues: FieldValue[]): void => {
    const fieldValuesMap = new Map<string, FieldValue[]>()

    fieldValues.forEach(fieldValue => {
      const { sectionName } = fieldValue

      if (fieldValuesMap.has(sectionName)) {
        fieldValuesMap.get(sectionName)?.push(fieldValue)
      } else {
        fieldValuesMap.set(sectionName, [fieldValue])
      }
    })

    const fieldValuesMapKeys = Array.from(fieldValuesMap.keys())
    const fieldValuesMapSorted = new Map<string, FieldValue[]>()

    fieldValuesMapKeys.forEach(key => {
      const fieldValues = fieldValuesMap.get(key)

      fieldValues?.sort((a, b) => a.index - b.index)

      fieldValuesMapSorted.set(key, fieldValues ?? [])
    })

    setFieldValues(fieldValuesMapSorted)
  }

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  const driver = useMemo(() => {
    return supervision.supervisionProfiles.find((supervisionProfile) => supervisionProfile.role.toUpperCase() === 'CONDUCTOR') ?? null
  }, [supervision])

  const inspector = useMemo(() => {
    return supervision.supervisionProfiles.find((supervisionProfile) => supervisionProfile.role.toUpperCase() === 'SUPERVISOR') ?? null
  }, [supervision])

  const exportPdf = (): void => {
    setIsPdfLoading(true)
    const supervisionPDFService = new SupervisionPDFServices()
    void supervisionPDFService.exportPdf(supervision.id, supervision.code, 'SUBIDA')
      .then(() => {
        setIsPdfLoading(false)
      })
  }

  const showCheckpoint = (group: CheckpointGroup): void => {
    navigate(`/detalle-checkpoints?supervision-id=${supervision.id}&group-id=${group.id}`)
  }

  const images: FieldValue[] = useMemo(() => {
    const values = Array.from(fieldValues.entries())

    const images: FieldValue[] = []

    values.forEach(([key, value]) => {
      const fieldValuesWithImageEvidence = value.filter(fieldValue => fieldValue.imageEvidence !== null && fieldValue.imageEvidence.length > 0)

      images.push(...fieldValuesWithImageEvidence)
    })

    return images
  }, [fieldValues])

  return (
    <div className={`${!isPreviewPage ? 'container-page' : ''}`}>
      <h1 className='text-2xl uppercase font-semibold'>Supervisión - Checklist Subida - {supervision.code}</h1>
      {!isPreviewPage && (
        <div>
          <p className='text-sm italic'>** La primera vez que se descargue el reporte, la espera será mayor **</p>
          <div className='flex gap-2 mt-2'>
            {
              supervision.checkpointGroups.filter((group) => group.type === 'Bajada').map((checkpointGroup) =>
                <Button
                  key={checkpointGroup.id}
                  color='secondary'
                  onClick={() => { showCheckpoint(checkpointGroup) }}>Supervisión - Checklist {checkpointGroup.type}</Button>
              )
            }
            {supervision.code !== '' && <Button color='primary' onClick={exportPdf} isLoading={isPdfLoading}>Exportar PDF</Button>}
          </div>
        </div>
      )}

      <div className='h bg-gray-400 w-full my-4'></div>
      <div className='border border-black border-b-0 mx-auto h-full mb-10'>
        <div className='grid grid-cols-3 border-b border-black'>
          <div className='grid place-items-center border-r border-black'>
            <div className='p-5'>
              <img src="./logo-header.png" alt="" width={250} />
            </div>
          </div>
          <div className='flex flex-col border-r border-black'>
            <div className="grid place-items-center h-full">
              <p className='text-center uppercase font-bold text-lg'>Inspección de {supervision.template.name}</p>
            </div>
          </div>
          <div className=''>
            <div className='h-1/2 border-b border-black'>
              <div className='h-full px-2 flex gap-2 items-center font-semibold'>
                <p>Código:</p>
                <p >{supervision.code}</p>
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
            <p className='py-3 px-2 text-center'>{supervision.fuel}</p>
          </div>
          <div className=''>
            <p className='py-3 px-2 text-sm font-semibold'>Guía de remisión</p>
          </div>
        </div>

        <div className='w-[100%] h-56 grid grid-cols-3 border-r text-sm [&>div>div>p]:py-1 [&>div>div]:flex [&>div>div]:gap-1 [&>div>div]:h-[25%] [&>div>div]:border-b [&>div>div]:border-black [&>div>div]:items-center [&>div>div]:overflow-hidden [&>div>div>p]:px-1 [&>div>div>p]:h-full'>
          <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Empresa:</p>
              <p className='w-[70%]'>{supervision.vehicleDescription?.company}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Fecha:</p>
              <p className='w-[70%]'>{moment(supervision.createdAt).format('DD/MM/YYYY')}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Tipo de Vehículo:</p>
              <p className='w-[70%]'>{supervision.vehicle?.vehicleType.name}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Placa de vehículo:</p>
              <p className='w-[70%]'>{supervision.vehicle?.licensePlate}</p>
            </div>
          </div>
          <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Hora de ingreso:</p>
              <p className='w-[70%]'>{moment(supervision.timeStart).format('hh:mm A')}</p>
            </div>
            <div className=''>
              <p className='border-r border-black w-[30%] font-bold'>Contratante:</p>
              <p className='w-[70%]'>{supervision.vehicleDescription?.contractor}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Marca:</p>
              <p className='w-[70%]'>{supervision.vehicle?.brand}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Año de fabricación:</p>
              <p className='w-[70%]'>-</p>
            </div>
          </div>
          <div className='[&>div]:border-b [&>div]:border-black '>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Hora de salida:</p>
              <p className='w-[70%]'>{moment(supervision.timeEnd).format('hh:mm A')}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Tipo de Carga:</p>
              <p className='w-[70%]'>{supervision.materialType !== null ? supervision.materialType : '-'}</p>
            </div>
            <div>
            </div>
            <div>
            </div>
          </div>
        </div>

        <div className='uppercase'>
          {
            Array.from(fieldValues.keys()).map((key) => {
              const value = fieldValues.get(key) ?? []
              return (
                <div
                  key={key}
                  className=''
                >
                  <div className='border-b border-black bg-gray-500 text-white'>
                    <div className='flex'>
                      <div className='w-[70%] grid items-center'>
                        <p className='px-2 text-center text-lg font-bold'>{key.toUpperCase()}</p>
                      </div>
                      <div className='w-[30%] flex flex-col gap-2 border-l border-white font-bold'>
                        <p className='text-center'>cumple</p>
                        <div className='grid grid-cols-3 text-center border-t border-white'>
                          <p className=''>si</p>
                          <p className=' border-l border-white'>no</p>
                          <p className=' border-l border-white'>na</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    {
                      value.map((fieldValue) => {
                        return (
                          <div key={fieldValue.fieldId} className='flex border-b border-black'>
                            <div className='w-[70%] flex items-center'>
                              <div className='h-full w-[10%] text-center border-r border-black grid place-items-center bg-gray-500 text-white font-bold'>
                                <p className='py-3'>{fieldValue.index + 1}</p>
                              </div>
                              <div className='w-[90%]'>
                                <div className='flex items-center gap-3'>
                                  <p className='py-2 px-2 font-semibold'>{fieldValue.fieldLabel}</p>
                                  {fieldValue.imageEvidence !== '' && !isPreviewPage && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(fieldValue.imageEvidence, fieldValue.fieldLabel) }}></EyeIcon>}
                                </div>
                              </div>
                            </div>
                            <div className='w-[30%] border-l border-black'>
                              <div className='grid grid-cols-3 text-center h-full'>
                                <p className='py-2 self-center'>{fieldValue.value.toUpperCase() === 'SI' && 'x'}</p>
                                <div className='py-2 border-l border-black flex justify-center'>
                                  <p className='self-center'>{fieldValue.value.toUpperCase() === 'NO' && 'x'}</p>
                                </div>
                                <div className='py-2 border-l border-black flex justify-center'>
                                  <p className='self-center'>{fieldValue.value.toUpperCase() === 'NO APLICA' && 'x'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className='border-b border-black'>
          <p className='p-4'>{ritraContent.content}</p>
        </div>

        <div className='border-b border-black'>
          <div className='px-4 py-2'>
            <p>Número de neumáticos registrados: {supervision.wheelsDescription.numberOfWheels} </p>

            <div className='grid grid-cols-12 gap-2 mt-2'>
              {supervision.wheelsDescription.wheels.map((wheel, index) => (
                <div key={index}>
                  <div className='bg-black rounded-full text-white text-center p-3'>
                    <p className='font-semibold uppercase text-center'>{wheel.position}</p>
                    <p className='text-sm lowercase text-center'>{wheel.status}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 text-center border-b border-black'>
          <div className='border-r border-black'>
            <div className='border-b border-black bg-gray-500 text-white py-2'>
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
            <div className='border-b border-black bg-gray-500 text-white py-2'>
              <p>INSPECCIONADO POR SUPERVISOR</p>
            </div>
            <div className='py-2 flex flex-col justify-center border-b border-black'>
              <p>Nombre y apellido</p>
              <p className='font-bold'>{inspector?.profile.fullName}</p>
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

      {isPreviewPage && (<div className='break-inside-avoid'>
        <h2 className='uppercase font-semibold text-2xl'>Evidencias del checklist</h2>
        <Divider className='mt-2' />
        {
          images.length > 0 && (
            <div className='grid grid-cols-2 gap-10 '>
              {
                images.map((image) => {
                  return (
                    <div key={image.fieldId} className='flex flex-col justify-start items-start break-inside-avoid'>
                      <p className='font-semibold'>{image.index + 1}.- {image.fieldLabel}</p>
                      <div className='h-[450px]'>
                        <img src={image.imageEvidence} alt='evidence' className='w-full h-full object-contain' />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </div>)}
      {showImage && <ShowImageEvidence isOpen={showImage} imageUrl={fieldSelected.url} name={fieldSelected.name} onClose={() => { setShowImage(false) }} />}
    </div>

  )
}

export default SupervisionDetail

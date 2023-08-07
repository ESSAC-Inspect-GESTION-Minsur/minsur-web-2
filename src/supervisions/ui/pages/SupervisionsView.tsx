import React, { useState, useEffect, type ReactElement, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { findAllSupervisions, getDateRange, getLastDateRequest, getStatus, getSupervisions } from '@/shared/config/store/features/supervisions-slice'
import { STATUS } from '@/shared/config/store/types'
import { type AppDispatch } from '@/shared/config/store'
import Button from '@/shared/ui/components/Button'

import SupervisionsTable from './SupervisionsTable'
import { DateRange, LOCALE_OPTIONS, type DateRangeObject } from '@/shared/types/date-range'
import Divider from '@/shared/ui/components/Divider'
// import { generateExcel } from '@/supervisions/utils/json-to-sheet'
import { type Supervision } from '@/supervisions/models/supervision.interface'
import { generateExcel } from '@/supervisions/utils/json-to-sheet'
import { supervisionsToExcel } from '@/supervisions/utils/supervisions-to-excel'

const SupervisionsView = (): ReactElement => {
  const dispatch = useDispatch<AppDispatch>()

  const supervisions = useSelector(getSupervisions)
  const lastDateRequest = useSelector(getLastDateRequest)
  const supervisionStatus = useSelector(getStatus)
  const dateRangeStore = useSelector(getDateRange)

  const [dateRange, setDateRange] = useState<DateRange>(new DateRange())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>('')

  const supervisionsFiltered = useRef<Supervision[]>(supervisions)

  const setSupervisionsFiltered = (supervisions: Supervision[]): void => {
    supervisionsFiltered.current = supervisions
  }

  const exportExcel = (): void => {
    setIsExportingExcel(true)
    void generateExcel(supervisionsFiltered.current.map(supervisionsToExcel))
      .finally(() => {
        setTimeout(() => {
          setIsExportingExcel(false)
        }, 2000)
      })
  }

  useEffect(() => {
    const supervisionsJson = sessionStorage.getItem('supervisions-request')
    if (!supervisionsJson) {
      void dispatch(findAllSupervisions({ dateRange: new DateRange(), profileId: '' }))
    }
  }, [])

  useEffect(() => {
    setIsLoading(supervisionStatus === STATUS.PENDING)
  }, [supervisionStatus])

  const findAll = (): void => {
    void dispatch(findAllSupervisions({ dateRange, profileId: '' }))
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  const onChangeInputDate = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    const date = new Date(value)
    date.setHours(date.getHours() + 5)

    const aux: DateRangeObject = {
      'date-start': new Date(dateRange._dateStart).toISOString(),
      'date-end': new Date(dateRange._dateEnd).toISOString()
    }

    aux[name as keyof DateRangeObject] = date.toISOString()

    setDateRange(DateRange.fromJson(aux))
  }

  return (
    <div>
      <div className='mt-4 mb-2 flex justify-between items-center'>
        <h1 className="font-bold text-3x text-left  uppercase text-3xl">Supervisiones</h1>
        <div className='flex gap-2'>
          {supervisions.length > 0 && <Button color='primary' onClick={() => { setShowFilter(!showFilter) }}>{showFilter ? 'Ocultar filtros' : 'Mostrar filtros'}</Button>}
          {supervisions.length > 0 && <Button color='secondary' onClick={exportExcel} isLoading={isExportingExcel}>Exportar Excel</Button>}
        </div>
      </div>
      <Divider></Divider>
      <p className='font-medium uppercase'>Filtro</p>
      <div className='flex gap-7 items-center justify-between mt-2'>
        <div className='flex justify-between w-3/5 gap-5'>
          <div className='w-1/2'>
            <p>Fecha Inicio</p>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type="date"
              name='date-start'
              value={dateRange.formattedDateStart()}
              onChange={onChangeInputDate}
            />
          </div>
          <div className='w-1/2'>
            <p>Fecha Fin</p>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type="date"
              name='date-end'
              value={dateRange.formattedDateEnd()}
              onChange={onChangeInputDate}
            />
          </div>
        </div>

        <div className='flex gap-3 justify-end items-center w-2/5'>
          <div>
            <p className='font-bold'>Fecha de última búsqueda</p>
            <p>{lastDateRequest !== null ? lastDateRequest.toLocaleDateString('es-PE', { ...LOCALE_OPTIONS, hour: '2-digit', minute: '2-digit', hourCycle: 'h12' }) : ''}</p>
            <p className='font-bold'>Rango de fecha solicitada</p>
            <div className='flex gap-2 font-semibold'>
              <p>{dateRangeStore.isoFormattedStringDateStart()}</p>
              <p>A</p>
              <p>{dateRangeStore.isoFormattedStringDateEnd()}</p>
            </div>
          </div>
          <Button color='secondary' onClick={findAll} isLoading={isLoading}>Buscar supervisiones</Button>
        </div>
      </div>

      <div className='mb-6'></div>

      <SupervisionsTable supervisions={supervisions} showFilter={showFilter} setSupervisionsFiltered={setSupervisionsFiltered} />

    </div>
  )
}

export default SupervisionsView

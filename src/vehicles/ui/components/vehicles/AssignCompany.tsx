import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { type Company } from '@/companies/models/company.interface'
import { CompaniesService } from '@/companies/services/company.service'
import { VehicleContext } from '../../contexts/VehicleContext'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import SelectInput from '@/shared/ui/components/SelectInput'

interface AddVehicleFormProps {
  isOpen: boolean
  onClose: () => void
}

const AssignCompany = ({ isOpen, onClose }: AddVehicleFormProps): ReactElement => {
  const { toastId, selectedVehicle, updateVehicle, setSelectedVehicle } = useContext(VehicleContext)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then((response) => {
        const companies = selectedVehicle?.companies ?? []

        const profileCompanies = companies.map((company) => company.id)
        const companiesFiltered = response.filter((company) => !profileCompanies?.includes(company.id))
        setCompanies(companiesFiltered)
      })
  }, [selectedVehicle])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const vehiclesService = new VehiclesService()

    vehiclesService.assignCompany(selectedVehicle?.licensePlate ?? '', selectedCompany?.id ?? '')
      .then((response) => {
        updateVehicle(response)
        setSelectedVehicle(response)
        toast('Empresa agregada correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch(() => {
        toast('Hubo un error, intente más tarde', { toastId, type: 'error' })
        onClose()
      })
  }

  const modal = (): ReactElement => (
    <>
      <div className='mb-4'>
        <p className='text-center uppercase font-bold text-xl'>Asignar Empresa</p>
        <p className='text-center uppercase '><span className='font-bold'>Vehículo seleccionado:</span> {selectedVehicle?.licensePlate}</p>
      </div>

      <form onSubmit={handleSubmit}>

        <SelectInput<Company>
            label='Empresa'
            name='company'
            objects={companies}
            setValue={(name, value) => {
              const company = companies.find((company) => company.id === value)
              if (!company) return
              setSelectedCompany(company)
            }}
            value={selectedCompany?.id ?? ''}
            optionKey='name'
            valueKey='id'
            searchable={true}
          />

        <div className='flex justify-center gap-5 mt-2'>
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
          <Button color='primary' type='submit'>Agregar</Button>
        </div>
      </form>
    </>
  )

  const assignCompanyMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>No hay empresas, por favor añade una empresa para asignarla</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='secondary' onClick={onClose}>Close</Button>
      </div>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-full min-w-[300px] sm:min-w-[600px]'>
      <div className='p-3'>
        {companies.length > 0 ? modal() : assignCompanyMessage()}
      </div>
    </Modal>
  )
}

export default AssignCompany

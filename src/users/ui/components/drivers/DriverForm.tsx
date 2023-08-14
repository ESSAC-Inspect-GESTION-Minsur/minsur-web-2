import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { DriverContext } from '../../contexts/DriverContext'
import { PROFILE_DTO_INITIAL_STATE, type ProfileDto } from '@/users/models/profile.interface'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { ProfilesService } from '@/users/services/profile.service'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import Divider from '@/shared/ui/components/Divider'
import { INITIAL_STATE_COMPANY, type Company } from '@/companies/models/company.interface'
import { CompaniesService } from '@/companies/services/company.service'
import SelectInput from '@/shared/ui/components/SelectInput'
import { isDate } from '@/shared/utils'
import RecoverDriverModal from './RecoverDriverModal'

interface DriverFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const DriverFormModal = ({ isOpen, onClose }: DriverFormModalProps): ReactElement => {
  const { driverForm, setDriverForm, addDriver, updateDriver, toastId, setSelectedDriver } = useContext(DriverContext)

  const [driver, setDriverValue, setDriver, reset] = useDataForm<ProfileDto>(PROFILE_DTO_INITIAL_STATE)

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company>(INITIAL_STATE_COMPANY)

  const [formAction, setFormAction] = useState<FormAction>('add')
  const [hasSecondLicense, setHasSecondLicense] = useState<boolean>(false)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (driverForm === null) {
      setFormAction('add')
      return
    }

    const { name, lastName, dni, firstLicense, secondLicense, isDriver } = driverForm
    setFormAction('update')

    setDriver({
      name,
      lastName,
      dni,
      firstLicense,
      secondLicense,
      isDriver,
      phone1: null,
      phone2: null,
      email: null,
      removed: false
    })
  }, [driverForm])

  useEffect(() => {
    setDriver({
      ...driver,
      secondLicense: {
        license: hasSecondLicense ? '' : null,
        category: hasSecondLicense ? '' : null,
        expiration: hasSecondLicense ? new Date().toISOString() : null
      }
    })
  }, [hasSecondLicense])

  useEffect(() => {
    const companiesServices = new CompaniesService()
    void companiesServices.findAll()
      .then((companies) => {
        if (companies.length === 0) return

        setCompanies(companies)
        setSelectedCompany(companies[0])
      })
  }, [])

  const handleCloseRecoverModal = (removed: boolean): void => {
    setIsRecoverModalOpen(false)
    setIsSubmitting(false)
    if (removed) {
      onClose()
    }
  }

  const handleCancel = (): void => {
    setDriverForm(null)
    reset()
    onClose()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsSubmitting(true)
    const profilesService = new ProfilesService()

    const submitAction = formAction === 'add' ? profilesService.create : profilesService.update
    const onFinishAction = formAction === 'add' ? addDriver : updateDriver
    const id = formAction === 'add' ? '' : driverForm?.id ?? ''

    driver.firstLicense.license = driver.firstLicense.license === '' ? null : driver.firstLicense.license
    driver.firstLicense.category = driver.firstLicense.category === '' ? null : driver.firstLicense.category

    driver.secondLicense.license = driver.secondLicense.license === '' ? null : driver.secondLicense.license
    driver.secondLicense.category = driver.secondLicense.category === '' ? null : driver.secondLicense.category

    driver.phone1 = null
    driver.phone2 = null
    driver.email = null

    driver.isDriver = true

    void profilesService.findRemovedByDni(driver.dni)
      .then((response) => {
        const { find } = response

        if (find && formAction === 'add') {
          setIsRecoverModalOpen(true)
        } else {
          void submitAction(driver, id)
            .then((response) => {
              if (formAction === 'add') {
                if (selectedCompany === INITIAL_STATE_COMPANY) {
                  onFinishAction(response)
                } else {
                  void profilesService.assignCompany(response.id, selectedCompany.id)
                    .then((profileWithCompany) => {
                      onFinishAction(profileWithCompany)
                      if (driverForm) {
                        setSelectedDriver(response)
                      }
                    })
                }
              } else {
                onFinishAction(response)
                if (driverForm) {
                  setSelectedDriver(response)
                }
              }

              setDriverForm(null)
              reset()
              onClose()
              toast(`Conductor ${formAction === 'add' ? 'añadido' : 'actualizado'} correctamente`, { toastId, type: 'success' })
            })
            .catch(error => {
              const { message } = error.data
              const errorMessage = typeof message === 'object' ? message.join(' ') : message
              toast(errorMessage, { toastId, type: 'error' })
            })
            .finally(() => {
              setIsSubmitting(false)
            })
        }
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-center uppercase font-semibold text-xl'>Agregar Conductor</h2>
      <Divider className='mt-0' />
      <form onSubmit={(event) => { void handleSubmit(event) }}>
        <Input
          label='Nombre'
          name='name'
          placeholder='Ingresa nombre'
          value={driver.name}
          setValue={setDriverValue}
          type='text'
        />

        <Input
          label='Apellido'
          name='lastName'
          placeholder='Ingresa apellido'
          value={driver.lastName}
          setValue={setDriverValue}
          type='text'
        />

        <Input
          label='DNI'
          name='dni'
          placeholder='Ingresa dni'
          value={driver.dni}
          setValue={setDriverValue}
          type='text'
        />

        {
          formAction === 'add' && companies.length > 0 && (
            <SelectInput<Company>
              label='Empresa'
              name='company'
              objects={companies}
              setValue={(name, value) => {
                const company = companies.find(company => company.id === value)
                if (!company) return
                setSelectedCompany(company)
              }}
              value={selectedCompany.id}
              optionKey='name'
              valueKey='id'
            />
          )
        }

        {
          driver.firstLicense.license !== null &&
          <Input
            label='Licencia'
            name='license'
            placeholder='Ingresa licencia'
            value={driver.firstLicense.license}
            setValue={(name, value) => {
              setDriver({
                ...driver,
                firstLicense: {
                  ...driver.firstLicense,
                  license: String(value)
                }
              })
            }}
            type='text'
          />
        }

        {
          driver.firstLicense.category !== null &&
          <Input
            label='Categoría de Licencia'
            name='licenseCategory'
            placeholder='Ingresa categoría de licencia'
            value={driver.firstLicense.category}
            setValue={(name, value) => {
              setDriver({
                ...driver,
                firstLicense: {
                  ...driver.firstLicense,
                  category: String(value)
                }
              })
            }}
            type='text'
            required={false}
          />
        }

        {
          driver.firstLicense.expiration !== null && isDate(driver.firstLicense.expiration) &&
          <Input
            label='Fecha de vencimiento de la licencia'
            name='licenseExpiration'
            placeholder=''
            value={new Date(driver.firstLicense.expiration).toISOString().substring(0, 10)}
            setValue={(name, value) => {
              setDriver({
                ...driver,
                firstLicense: {
                  ...driver.firstLicense,
                  expiration: String(value)
                }
              })
            }}
            type='date'
          />
        }

        <Input
          label='¿Tiene segunda licencia?'
          name='hasSecondLicense'
          placeholder=''
          value={hasSecondLicense ? 'true' : 'false'}
          setValue={() => {
            setHasSecondLicense(!hasSecondLicense)
          }}
          type='checkbox'
        />

        {
          hasSecondLicense && (
            <>
              {
                driver.secondLicense.license !== null &&
                <Input
                  label='Licencia'
                  name='license'
                  placeholder='Ingresa licencia'
                  value={driver.secondLicense.license}
                  setValue={(name, value) => {
                    setDriver({
                      ...driver,
                      secondLicense: {
                        ...driver.secondLicense,
                        license: String(value)
                      }
                    })
                  }}
                  type='text'
                />
              }

              {
                driver.secondLicense.category !== null &&
                <Input
                  label='Categoría de Licencia'
                  name='licenseCategory'
                  placeholder='Ingresa categoría de licencia'
                  value={driver.secondLicense.category}
                  setValue={(name, value) => {
                    setDriver({
                      ...driver,
                      secondLicense: {
                        ...driver.secondLicense,
                        category: String(value)
                      }
                    })
                  }}
                  type='text'
                  required={false}
                />
              }

              {
                driver.secondLicense.expiration !== null && isDate(driver.secondLicense.expiration) &&
                <Input
                  label='Fecha de vencimiento de la licencia'
                  name='licenseExpiration'
                  placeholder=''
                  value={new Date(driver.secondLicense.expiration).toISOString().substring(0, 10)}
                  setValue={(name, value) => {
                    setDriver({
                      ...driver,
                      secondLicense: {
                        ...driver.secondLicense,
                        expiration: String(value)
                      }
                    })
                  }}
                  type='date'
                />
              }
            </>
          )
        }

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>

      <RecoverDriverModal isOpen={isRecoverModalOpen} onClose={handleCloseRecoverModal} profile={driver} />
    </Modal>

  )
}

export default DriverFormModal

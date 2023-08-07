import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { type ProfileDto } from '@/users/models/profile.interface'
import { ProfilesService } from '@/users/services/profile.service'
import React, { useContext, type ReactElement } from 'react'
import { DriverContext } from '../../contexts/DriverContext'
import { toast } from 'react-toastify'

interface RecoverDriverModalProps {
  isOpen: boolean
  onClose: (recovered: boolean) => void
  profile: ProfileDto
}

const RecoverDriverModal = ({ profile, isOpen, onClose }: RecoverDriverModalProps): ReactElement => {
  const { addDriver, toastId } = useContext(DriverContext)

  const onRecover = (update: boolean): void => {
    const profilesService = new ProfilesService()

    const body = update
      ? {
          ...profile,
          removed: false
        }
      : { removed: false }

    void profilesService.updateByDni(body, profile.dni)
      .then((profile) => {
        addDriver(profile)
        toast.success('Usuario recuperado', { toastId })
        onClose(true)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(false) }}>
      <p>El usuario con el dni {profile.dni} ya existe</p>
      <p>¿Desea recuperar el usuario?</p>
      <div className='mt-2 [&>button]:block [&>button]:mt-1'>
        <Button color='primary' onClick={ () => { onRecover(false) }}>Recuperar</Button>
        <Button color='primary' onClick={ () => { onRecover(true) }}>Recuperar y actualizar</Button>
        <Button color='secondary' onClick={() => { onClose(false) }}>Cancelar</Button>
      </div>
    </Modal>
  )
}

export default RecoverDriverModal

import Modal from '@/shared/ui/components/Modal'
import React, { useContext, type ReactElement, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Button from '@/shared/ui/components/Button'
import { toast } from 'react-toastify'
import Divider from '@/shared/ui/components/Divider'
import Input from '@/shared/ui/components/Input'
import { AuthServices } from '@/auth/services/auth.service'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps): ReactElement => {
  const { toastId, selectedUser, updateUser, setSelectedUser } = useContext(UserContext)

  const [newPassword, setNewPassword] = useState<string>('')

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (!selectedUser) return
    event.preventDefault()

    const authService = new AuthServices()

    void authService.changePassword(newPassword, selectedUser.id)
      .then((response) => {
        updateUser(response)
        setSelectedUser(response)
        toast('Contraseña actualizada correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='text-center uppercase font-semibold'>
        <h3>Actualizar contraseña</h3>
        <p>Usuario: {selectedUser?.username}</p>
      </div>

      <Divider className='mt-0'></Divider>

      <form onSubmit={onSubmit}>
        <Input
          label='Nueva contraseña'
          type='password'
          name='newPassword'
          value={newPassword}
          placeholder=''
          setValue={(name, value) => {
            setNewPassword(value.toString())
          }}
        />

        <div className='flex gap-2 mt-4'>
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
          <Button color='primary' type='submit'>Confirmar</Button>
        </div>
      </form>

    </Modal>
  )
}

export default ChangePasswordModal

import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { PROFILE_INITIAL_STATE, type Profile } from '@/users/models/profile.interface'
import Divider from '@/shared/ui/components/Divider'
import Button from '@/shared/ui/components/Button'
import ChangePasswordModal from './ChangePasswordModal'

interface UserDetailProps {
  toggleForm: () => void
  toggleAssignSponsorModal: () => void
}

const UserDetail = ({ toggleForm, toggleAssignSponsorModal }: UserDetailProps): ReactElement => {
  const { selectedUser, setUserForm } = useContext(UserContext)
  const [profile, setProfile] = useState<Profile>(PROFILE_INITIAL_STATE)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!selectedUser) return

    setProfile(selectedUser.profile)
  }, [selectedUser])

  const handleEdit = (): void => {
    setUserForm(selectedUser)
    toggleForm()
  }

  const handleToggleChangePassword = (): void => {
    setIsChangePasswordOpen(!isChangePasswordOpen)
  }

  return (
    <section className='shadow-card rounded-md w-[30%] py-3 px-5'>
      <h1 className='text-center font-semibold uppercase text-lg'>Detalle de Usuario</h1>
      <Divider className='mt-1' />
      <div className='capitalize'>
        <p><span className='font-semibold uppercase'>Usuario:</span> {selectedUser?.username}</p>
        <p><span className='font-semibold uppercase'>Rol:</span> {selectedUser?.role}</p>
        <p><span className='font-semibold uppercase'>Estado:</span> {selectedUser?.active ? 'Activo' : 'No Activo'}</p>

        <Divider />

        <p><span className='font-semibold uppercase'>Nombre:</span> {profile.name}</p>
        <p><span className='font-semibold uppercase'>Apellido:</span> {profile.lastName}</p>
        <p><span className='font-semibold uppercase'>Dni:</span> {profile.dni}</p>
        <p><span className='font-semibold uppercase'>Teléfono 1:</span> {profile.phone1}</p>
        <p><span className='font-semibold uppercase'>Teléfono 2:</span> {profile.phone2 ?? 'No registrado'}</p>
        <p><span className='font-semibold uppercase'>correo:</span> {profile.email ?? 'No registrado'}</p>
      </div>

      <Divider />

      {
        selectedUser && selectedUser.sponsors.length === 0 && (
          <p className='font-bold'>Empresa: <span className='font-normal'>ESSAC</span></p>
        )
      }

      {
        selectedUser && selectedUser.sponsors.length > 0 && (
          <div>
            <p className='font-semibold uppercase'>Sponsors:</p>
            <ul>
              {
                selectedUser?.sponsors.map(sponsor => (
                  <li className='ml-2' key={sponsor.id}>{sponsor.name}</li>
                ))
              }
            </ul>
          </div>
        )
      }

      <div className='mt-4 flex gap-3 justify-end'>
        <Button color='secondary' onClick={handleEdit}>Editar</Button>
        <Button color='primary' onClick={handleToggleChangePassword}>Cambiar contraseña</Button>
        {/* <Button color='secondary' onClick={toggleAssignSponsorModal}>Asignar Sponsor</Button> */}
      </div>

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={handleToggleChangePassword}/>
    </section>
  )
}

export default UserDetail

import React, { type ReactElement, useContext, Fragment } from 'react'
import { toast } from 'react-toastify'

import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'

import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { TemplateGroupContext } from '@/supervisions/ui/contexts/TemplateGroupContext'
import TemplateGroupForm from './TemplateGroupForm'

const TemplateGroupComponent = (): ReactElement => {
  const {
    templateGroups,
    selectedTemplateGroup,
    setSelectedTemplateGroup,
    setTemplateGroupForm,
    toastId,
    removeTemplateGroup
  } = useContext(TemplateGroupContext)

  const handleUpdate = (templateGroup: TemplateGroup): void => {
    setTemplateGroupForm(templateGroup)
  }

  const handleRemove = (templateGroup: TemplateGroup): void => {
    const templateGroupsService = new TemplateGroupsService()
    const result = confirm(`Estás seguro que quieres eliminar el grupo de checklist: ${templateGroup.name}`)
    if (!result) return

    const id = templateGroup.id
    void templateGroupsService.remove(id)
      .then(() => {
        removeTemplateGroup(id)
        setSelectedTemplateGroup(null)
        toast('Grupo eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const templateGroupDetail = (templateGroup: TemplateGroup): ReactElement => {
    return (
      <div key={templateGroup.id}
        onClick={() => { setSelectedTemplateGroup(templateGroup) }}
        className={`cursor-pointer w-full flex justify-between items-center py-2 border-b-2  rounded-r-xl ${templateGroup.id === selectedTemplateGroup?.id ? 'bg-blue text-white' : ''}`}>
        <p className='px-2'>{templateGroup.name}</p>
        <div className='flex gap-3 px-2'>
          <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(templateGroup) }} />
          <DeleteIcon className='cursor-pointer w-5 h-5 ' onClick={() => { handleRemove(templateGroup) }} />
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <section>
        {
          templateGroups.map(templateGroup => templateGroupDetail(templateGroup))
        }
      </section>
      {templateGroups.length <= 0 && (<p>No hay grupos registrados</p>)}
      <section>
        <TemplateGroupForm />
      </section>
    </Fragment>

  )
}

export default TemplateGroupComponent

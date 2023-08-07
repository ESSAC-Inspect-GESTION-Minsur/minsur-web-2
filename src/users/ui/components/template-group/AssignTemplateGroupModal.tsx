import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import Modal from '@/shared/ui/components/Modal'
import SelectInput from '@/shared/ui/components/SelectInput'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { ProjectContext } from '../../contexts/ProjectContext'
import { useTemplateGroupToAssign } from '../../hooks/useTemplateGroupToAssign'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { toast } from 'react-toastify'

interface AssignTemplateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  addTemplateGroup: (templateGroup: TemplateGroup) => void
}

const AssignTemplateGroupModal = ({ isOpen, onClose, addTemplateGroup }: AssignTemplateGroupModalProps): ReactElement => {
  const { selectedProject, toastId } = useContext(ProjectContext)

  const [selectedTemplateGroup, setSelectedTemplateGroup] = useState<TemplateGroup | null>(null)
  const [templateGroups] = useTemplateGroupToAssign(selectedProject)

  useEffect(() => {
    setSelectedTemplateGroup(templateGroups[0] ?? null)
  }, [templateGroups])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (selectedTemplateGroup === null || selectedProject === null) {
      onClose()
      return
    }

    const templateGroupService = new TemplateGroupsService()

    void templateGroupService.assignProject(selectedTemplateGroup.id, selectedProject.id)
      .then((templateGroup) => {
        addTemplateGroup(templateGroup)
        toast('Grupo de checklist asignado correctamente', { type: 'success', toastId })
        onClose()
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className='text-xl font-bold text-center'>Asignar grupo de checklist al proyecto {selectedProject?.name}</p>

      <Divider className='mt-2' />

      { templateGroups.length === 0 && <p className='text-center'>No hay grupos de checklist disponibles para asignar</p>}
      <form onSubmit={onSubmit}>
        {
          templateGroups.length > 0 && (<SelectInput<TemplateGroup>
            label='Grupos de checklist'
            objects={templateGroups}
            name='templateGroup'
            value={selectedTemplateGroup?.id ?? ''}
            setValue={(_, value) => {
              const templateGroup = templateGroups.find((templateGroup) => templateGroup.id === value)
              setSelectedTemplateGroup(templateGroup ?? null)
            }}
            optionKey='name'
            valueKey='id'
          />)
        }

        <div className='flex gap-3 mt-5'>
          { templateGroups.length > 0 && <Button color='primary' type='submit'>Asignar</Button>}
          <Button color='secondary' onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  )
}

export default AssignTemplateGroupModal

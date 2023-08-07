import React, { type ReactElement, useContext, useEffect } from 'react'

import { useArrayReducer } from '@/shared/hooks/useArrayReducer'

import { ProjectContext } from '../../contexts/ProjectContext'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import TemplateGroupsDetail from './TemplateGroupDetail'
import AssignTemplateGroupModal from './AssignTemplateGroupModal'
import { PROJECT_INITIAL_STATE } from '@/users/models/project.interface'

const TemplateGroupsComponent = (): ReactElement => {
  const { selectedProject, setSelectedProject } = useContext(ProjectContext)
  const [templateGroups, setTemplateGroups, addTemplateGroup,, deleteTemplateGroup] = useArrayReducer<TemplateGroup>(selectedProject?.templateGroups ?? [])

  const [showForm, toggleShowForm] = useBooleanState()

  useEffect(() => {
    setTemplateGroups(selectedProject?.templateGroups ?? [])
  }, [selectedProject])

  const handleAddTemplateGroup = (templateGroup: TemplateGroup): void => {
    addTemplateGroup(templateGroup)

    setSelectedProject({
      ...selectedProject ?? PROJECT_INITIAL_STATE,
      templateGroups: [...selectedProject?.templateGroups ?? [], templateGroup]
    })
  }

  const handleRemoveTemplateGroup = (id: string): void => {
    deleteTemplateGroup(id)

    setSelectedProject({
      ...selectedProject ?? PROJECT_INITIAL_STATE,
      templateGroups: selectedProject?.templateGroups?.filter((templateGroup) => templateGroup.id !== id) ?? []
    })
  }

  return (

    <section className='p-3'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold uppercase'>Grupo de checklist del proyecto {selectedProject?.name}</h2>
        { selectedProject && <Button color='primary' onClick={toggleShowForm}>Asignar Grupo de checklist</Button>}
      </div>
      <Divider></Divider>
      <TemplateGroupsDetail templateGroups={templateGroups} handleRemove={handleRemoveTemplateGroup}/>
      <AssignTemplateGroupModal isOpen={showForm} onClose={toggleShowForm} addTemplateGroup={handleAddTemplateGroup}/>
    </section>
  )
}

export default TemplateGroupsComponent

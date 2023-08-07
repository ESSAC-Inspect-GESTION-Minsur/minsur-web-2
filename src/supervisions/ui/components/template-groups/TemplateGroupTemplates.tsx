import React, { type ReactElement, useContext, useMemo } from 'react'
import { toast } from 'react-toastify'
import AssignTemplate from '@/supervisions/ui/components/template-groups/AssignTemplate'
import { type SupervisionTemplate } from '@/supervisions/models/supervision-template.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { TemplateGroupContext } from '@/supervisions/ui/contexts/TemplateGroupContext'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/Button'

const TemplateGroupChecklists = (): ReactElement => {
  const {
    selectedTemplateGroup: templateGroup,
    setSelectedTemplateGroup: setTemplateGroup,
    updateTemplateGroup,
    toastId
  } = useContext(TemplateGroupContext)

  const [showAssignTemplate, toggleShowAssignTemplate] = useBooleanState()

  const templates = useMemo(
    () => templateGroup?.templates ?? []
    , [templateGroup])

  const removeChild = (template: SupervisionTemplate): void => {
    const result = confirm(`Estás seguro que quieres desasignar el checklist: ${template.name ?? ''}`)
    if (!result) return
    const templateGroupService = new TemplateGroupsService()
    void templateGroupService.removeTemplate(templateGroup?.id ?? '', template.id ?? '')
      .then(response => {
        setTemplateGroup(response)
        updateTemplateGroup(response)
        toast('Checklist desasignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const body = (): React.ReactElement => {
    return (
      <section>
        <div className='flex justify-between items-center mb-3 gap-4'>
          <h2 className='uppercase font-bold text-lg'>Checklists asignados al <span className='text-red'>grupo {templateGroup?.name}</span></h2>
          <Button color='primary' onClick={toggleShowAssignTemplate}>Asignar Checklist</Button>
        </div>
        {
          templates.length > 0
            ? (
              <div className='flex gap-4 flex-wrap'>
                {
                  templates.map(template => (
                    <div key={template.id} className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between items-center gap-2'>
                      <p className='uppercase'>{template.name}</p>
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { removeChild(template) }} />
                    </div>
                  ))
                }
              </div>
              )
            : (
              <p>{'El tipo de vehículo no tiene ningún tipo de checklists asignado'}</p>
              )
        }
        {showAssignTemplate && <AssignTemplate isOpen={showAssignTemplate} onClose={toggleShowAssignTemplate}/>}
      </section>
    )
  }

  return (
    <>
      {
        templateGroup !== null && body()
      }
    </>
  )
}

export default TemplateGroupChecklists

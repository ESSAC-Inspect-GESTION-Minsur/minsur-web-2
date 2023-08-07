import React, { useEffect, useState, type ReactElement } from 'react'
import { type TemplateGroup } from '@/supervisions/models/template-group.interface'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Toast from '@/shared/ui/components/Toast'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { TemplateGroupContext } from '@/supervisions/ui/contexts/TemplateGroupContext'
import TemplateGroupComponent from '@/supervisions/ui/components/template-groups/TemplateGroupComponent'
import TemplateGroupTemplates from '@/supervisions/ui/components/template-groups/TemplateGroupTemplates'

const TOAST_ID = 'template-groups'

const TemplateGroupView = (): ReactElement => {
  const [templateGroups, setTemplateGroups, addTemplateGroup, updateTemplateGroup, removeTemplateGroup] = useArrayReducer<TemplateGroup>([])
  const [selectedTemplateGroup, setSelectedTemplateGroup] = useState<TemplateGroup | null>(null)
  const [templateGroupForm, setTemplateGroupForm] = useState<TemplateGroup | null>(null)

  useEffect(() => {
    const templateGroupsService = new TemplateGroupsService()
    void templateGroupsService.findAll()
      .then(response => {
        const groups = Array.from(response)
        groups.sort((a, b) => a.name.localeCompare(b.name))
        setTemplateGroups(groups)
      })
  }, [])

  useEffect(() => {
    if (templateGroups.length > 0 && selectedTemplateGroup === null) setSelectedTemplateGroup(templateGroups[0])
  }, [templateGroups])

  return (
    <TemplateGroupContext.Provider
      value={{
        toastId: TOAST_ID,
        templateGroups,
        addTemplateGroup,
        updateTemplateGroup,
        removeTemplateGroup,
        selectedTemplateGroup,
        setSelectedTemplateGroup,
        templateGroupForm,
        setTemplateGroupForm
      }}>

      <div className='container-page'>
        <div className='flex justify-between items-center'>
          <h1
            className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'
          >
            Grupo de Checklists
          </h1>

        </div>

        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <TemplateGroupComponent />
          </div>
          <div>
            <TemplateGroupTemplates />
          </div>
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </TemplateGroupContext.Provider>
  )
}

export default TemplateGroupView

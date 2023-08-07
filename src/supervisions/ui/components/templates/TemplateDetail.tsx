import React, { Fragment, useContext, type ReactElement } from 'react'
import { toast } from 'react-toastify'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import { type SupervisionTemplate } from '@/supervisions/models/supervision-template.interface'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'

const TemplateDetail = (): ReactElement => {
  const { templates, updateTemplate, selectedTemplate, setSelectedTemplate, setTemplateForm, toastId } = useContext(TemplateContext)

  const handleToggleSupervisionTemplateActive = (template: SupervisionTemplate): void => {
    const templatesService = new SupervisionTemplatesService()
    void templatesService.toggleActive(template.id)
      .then((template) => {
        updateTemplate(template)
        toast('Tipo de checklist actualizado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleOnSupervisionTemplateClick = (template: SupervisionTemplate): void => {
    setSelectedTemplate(template)
  }

  const handleUpdate = (template: SupervisionTemplate): void => {
    setTemplateForm(template)
  }

  return (
    <Fragment>
      {
        templates.length > 0
          ? (

              templates.map(template =>
                (
              <div key={template.id}
                onClick={() => { handleOnSupervisionTemplateClick(template) }}
                className={`w-full flex justify-between items-center py-2 rounded-r-xl cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-blue text-white' : ''}`}>
                <p className='px-2'>{template.name}</p>
                <div className='flex gap-3 px-2'>
                  <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(template) }} />
                  <div onClick={() => { handleToggleSupervisionTemplateActive(template) }}>
                    {
                      template.active
                        ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
                        : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
                    }
                  </div>
                </div>
              </div>
                ))

            )
          : (<p>No hay tipo de checklist</p>)
      }
    </Fragment>
  )
}

export default TemplateDetail

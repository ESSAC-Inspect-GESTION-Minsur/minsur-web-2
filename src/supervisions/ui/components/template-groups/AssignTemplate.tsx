import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { type SupervisionTemplate } from '@/supervisions/models/supervision-template.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import { TemplateGroupContext } from '@/supervisions/ui/contexts/TemplateGroupContext'
import { useNavigate } from 'react-router-dom'

interface AssignTemplateProps {
  isOpen: boolean
  onClose: () => void
}

const AssignTemplate = ({ isOpen, onClose }: AssignTemplateProps): ReactElement => {
  const {
    selectedTemplateGroup: templateGroup,
    setSelectedTemplateGroup: setTemplateGroup,
    toastId,
    updateTemplateGroup
  } = useContext(TemplateGroupContext)

  const navigate = useNavigate()

  const [templates, setTemplates] = useState<SupervisionTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<SupervisionTemplate | null>(null)

  useEffect(() => {
    const templateService = new SupervisionTemplatesService()
    void templateService.findAll()
      .then(response => {
        const actualTemplates = templateGroup?.templates ?? []
        const actualTemplateIds = actualTemplates.map(template => template.id)
        setTemplates(response.filter(template => !actualTemplateIds?.includes(template.id)))
      })
  }, [templateGroup])

  useEffect(() => {
    if (templates.length > 0) setSelectedTemplate(templates[0])
  }, [templates])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target
    const template = templates.find(template => template.id === value)
    setSelectedTemplate(template ?? null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const templateGroupService = new TemplateGroupsService()
    void templateGroupService.assignTemplate(templateGroup?.id ?? '', selectedTemplate?.id ?? '')
      .then(response => {
        setTemplateGroup(response)
        updateTemplateGroup(response)
        onClose()
        toast('Checklist asignado correctamente', { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit}>
        <label className='font-medium'>Checklists</label>
        <select
          className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
          onChange={handleSelectChange} value={selectedTemplate?.id}>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <div className='mt-4 flex gap-3'>
          <Button color='primary' type='submit'>Asignar</Button>
          <Button color='secondary' onClick={onClose}>Cerrar</Button>
        </div>
      </form>
    )
  }

  const addTemplateMessage = (): React.ReactElement => {
    return (
      <div>
        <p className='text-center mb-3 text-lg'>Todos los checklists están asignados, crea algún tipo de checklist si deseas asignar más</p>

        <div className='flex justify-center gap-3 items-center'>
          <Button color='primary' onClick={() => { navigate('/admin/reportes') }}>Añadir tipo de checklist</Button>
          <Button color='secondary' onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='min-w-[300px] sm:min-w-[600px] '>
      <div className='p-6'>
        <h2 className='uppercase font-bold text-center'>Asignar checklist al grupo {templateGroup?.name}</h2>
        {
          templates.length > 0 ? modal() : addTemplateMessage()
        }
      </div>

    </Modal >
  )
}

export default AssignTemplate

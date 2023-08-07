import React, { type ReactElement, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Toast from '@/shared/ui/components/Toast'
import { type SupervisionTemplate } from '@/supervisions/models/supervision-template.interface'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import { TemplateContext } from '../contexts/TemplateContext'
import TemplateDetail from '@/supervisions/ui/components/templates/TemplateDetail'
import TemplateForm from '@/supervisions/ui/components/templates/TemplateForm'
import SectionsComponent from '@/supervisions/ui/components/sections/SectionsComponent'
import Divider from '@/shared/ui/components/Divider'
import VehicleTypeComponent from '@/supervisions/ui/components/vehicle-types/VehicleTypeComponent'

const TOAST_ID = 'templates'

const TemplatesView = (): ReactElement => {
  const [templates, setSupervisionTemplates, addSupervisionTemplate, updateSupervisionTemplate] = useArrayReducer<SupervisionTemplate>([])

  const [selectedSupervisionTemplate, setSelectedSupervisionTemplate] = useState<SupervisionTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState<SupervisionTemplate | null>(null)

  useEffect(() => {
    const templatesService = new SupervisionTemplatesService()
    void templatesService.findAll()
      .then(response => {
        response.sort((a, b) => a.id > b.id ? 1 : -1)
        setSupervisionTemplates(response)
      })
  }, [])

  useEffect(() => {
    if (templates.length > 0 && selectedSupervisionTemplate === null) { setSelectedSupervisionTemplate(templates[0]) }
  }, [templates])

  useEffect(() => {
    setTemplateForm(null)
  }, [selectedSupervisionTemplate])

  return (
    <TemplateContext.Provider value={{
      templates,
      selectedTemplate: selectedSupervisionTemplate,
      setSelectedTemplate: setSelectedSupervisionTemplate,
      templateForm,
      setTemplateForm,
      addTemplate: addSupervisionTemplate,
      updateTemplate: updateSupervisionTemplate,
      toastId: TOAST_ID
    }}>

      <h1 className='text-2xl uppercase font-semibold'>Tipo de Checklist</h1>
      <Divider></Divider>
      <div className='sm:grid sm:grid-cols-table sm:gap-12'>
        <main className='mb-4'>
          <div className='mb-4'>
            <h2 className='uppercase font-bold mt-2'>Tipo de Checklist</h2>
            <TemplateDetail />
          </div>
          <div className='w-full border-t border-solid border-gray-light my-3'></div>
          <TemplateForm />
        </main>

        <div className='w-full border-t border-solid border-gray-light my-3 sm:hidden'></div>
        <div>
          <SectionsComponent />
          <div className='mt-10'>
            <VehicleTypeComponent />
          </div>
        </div>
      </div>

      <Toast id={TOAST_ID}></Toast>

    </TemplateContext.Provider>
  )
}

export default TemplatesView

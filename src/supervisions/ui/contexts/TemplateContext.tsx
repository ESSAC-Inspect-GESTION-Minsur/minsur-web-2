import React from 'react'
import { type SupervisionTemplate } from '@/supervisions/models/supervision-template.interface'

interface TemplateContextInterface {
  toastId: string

  templates: SupervisionTemplate[]
  addTemplate: (template: SupervisionTemplate) => void
  updateTemplate: (template: SupervisionTemplate) => void

  selectedTemplate: SupervisionTemplate | null
  setSelectedTemplate: (template: SupervisionTemplate | null) => void

  templateForm: SupervisionTemplate | null
  setTemplateForm: (templateForm: SupervisionTemplate | null) => void
}

export const TemplateContext = React.createContext<TemplateContextInterface>({
  toastId: '',
  templates: [],
  addTemplate: () => { },
  updateTemplate: () => { },
  selectedTemplate: null,
  setSelectedTemplate: () => { },
  templateForm: null,
  setTemplateForm: () => { }
})

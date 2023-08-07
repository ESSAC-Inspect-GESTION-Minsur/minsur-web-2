import React from 'react'
import { type TemplateGroup } from '@/supervisions/models/template-group.interface'

interface TemplateGroupContextInterface {
  toastId: string

  templateGroups: TemplateGroup[]
  addTemplateGroup: (TemplateGroup: TemplateGroup) => void
  updateTemplateGroup: (TemplateGroup: TemplateGroup) => void
  removeTemplateGroup: (id: string) => void

  selectedTemplateGroup: TemplateGroup | null
  setSelectedTemplateGroup: (TemplateGroup: TemplateGroup | null) => void

  templateGroupForm: TemplateGroup | null
  setTemplateGroupForm: (TemplateGroup: TemplateGroup | null) => void
}

export const TemplateGroupContext = React.createContext<TemplateGroupContextInterface>({
  toastId: '',
  templateGroups: [],
  addTemplateGroup: () => { },
  updateTemplateGroup: () => { },
  removeTemplateGroup: () => { },
  selectedTemplateGroup: null,
  setSelectedTemplateGroup: () => { },
  templateGroupForm: null,
  setTemplateGroupForm: () => { }
})

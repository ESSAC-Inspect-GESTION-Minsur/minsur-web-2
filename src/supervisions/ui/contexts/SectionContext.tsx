import { type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import React from 'react'

interface SectionContextInterface {
  sections: SupervisionSection[]
  addSection: (section: SupervisionSection) => void
  updateSection: (section: SupervisionSection) => void
  removeSection: (id: string) => void

  selectedSection: SupervisionSection | null
  setSelectedSection: (section: SupervisionSection | null) => void

  sectionForm: SupervisionSection | null
  setSectionForm: (sectionForm: SupervisionSection | null) => void

  toggleShowSectionDetail: () => void
  toggleShowSectionFormModal: () => void
}

export const SectionContext = React.createContext<SectionContextInterface>({
  sections: [],
  addSection: () => { },
  updateSection: () => { },
  removeSection: () => { },
  selectedSection: null,
  setSelectedSection: () => { },
  sectionForm: null,
  setSectionForm: () => { },
  toggleShowSectionDetail: () => { },
  toggleShowSectionFormModal: () => { }
})

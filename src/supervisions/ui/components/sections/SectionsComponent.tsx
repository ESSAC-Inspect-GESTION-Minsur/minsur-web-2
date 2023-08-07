import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import SectionComponent from './SectionComponent'
import SectionFormModal from './SectionFormModal'
import { SectionContext } from '@/supervisions/ui/contexts/SectionContext'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import SectionDetail from './SectionDetail'

const SectionsComponent = (): ReactElement => {
  const { selectedTemplate } = useContext(TemplateContext)

  const [sections, setSections, addSection, updateSection, removeSection] = useArrayReducer<SupervisionSection>([])

  const [selectedSection, setSelectedSection] = useState<SupervisionSection | null>(null)
  const [sectionForm, setSectionForm] = useState<SupervisionSection | null>(null)

  const [showSectionDetail, toggleShowSectionDetail] = useBooleanState()
  const [showSectionFormModal, toggleShowSectionFormModal] = useBooleanState()

  useEffect(() => {
    if (selectedTemplate === null) return

    const templatesService = new SupervisionTemplatesService()
    void templatesService.findAllSections(selectedTemplate.id)
      .then((response) => {
        const sectionsSorted = Array.from(response)
        sectionsSorted.sort((a, b) => a.name.localeCompare(b.name))
        setSections(sectionsSorted)
      })
  }, [selectedTemplate])

  const handleAddSupervisionSection = (): void => {
    toggleShowSectionFormModal()
    setSectionForm(null)
  }

  return (
    <SectionContext.Provider value={{
      sections,
      addSection,
      updateSection,
      removeSection,
      selectedSection,
      setSelectedSection,
      sectionForm,
      setSectionForm,
      toggleShowSectionDetail,
      toggleShowSectionFormModal
    }}>
      <section>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='uppercase font-bold text-lg'>Secciones del <span className='text-red'>checklist {selectedTemplate?.name}</span></h2>
          {selectedTemplate && <Button color='primary' onClick={handleAddSupervisionSection} className='mb-2'>Agregar sección</Button>}
        </div>
        <SectionComponent />

        <SectionFormModal isOpen={showSectionFormModal} onClose={toggleShowSectionFormModal}/>
        <SectionDetail isOpen={showSectionDetail} onClose={toggleShowSectionDetail}/>
      </section>
    </SectionContext.Provider>

  )
}

export default SectionsComponent

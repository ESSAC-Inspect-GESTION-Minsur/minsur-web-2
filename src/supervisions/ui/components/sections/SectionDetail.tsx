import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { SectionContext } from '@/supervisions/ui/contexts/SectionContext'
import { SupervisionSectionsService } from '@/supervisions/services/supervision-sections.service'
import { type FieldSection } from '@/supervisions/models/field-section.interface'
import AssignFieldForm from '../field-section/AssignFieldForm'
import UpdateFieldForm from '../field-section/UpdateFieldForm'
import FieldSectionsTable from '../field-section/FieldSectionsTable'

interface SectionModalProps {
  isOpen: boolean
  onClose: () => void
}

const SectionDetail = ({ isOpen, onClose }: SectionModalProps): ReactElement => {
  const { selectedSection } = useContext(SectionContext)

  const [fieldSections, setFieldSections, addFieldSection, updateFieldSection, removeFieldSection] = useArrayReducer<FieldSection>([])
  const [selectedFieldSection, setSelectedFieldSection] = useState<FieldSection | null>(null)

  const [showAssignField, toggleShowAssignField, setShowAssignField] = useBooleanState()
  const [showUpdateField, toggleShowUpdateField, setShowUpdateField] = useBooleanState()

  useEffect(() => {
    if (selectedSection === null) return

    const sectionsService = new SupervisionSectionsService()
    void sectionsService.findAllFields(selectedSection.id)
      .then(setFieldSections)
  }, [selectedSection])

  useEffect(() => {
    if (showAssignField) { setShowUpdateField(false) }
    if (showUpdateField) { setShowAssignField(false) }
  }, [showAssignField, showUpdateField])

  const handleClose = (): void => {
    onClose()
    setShowAssignField(false)
    setShowUpdateField(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='min-w-[600px] sm:min-w-[1000px]' onTop={true}>
      <div className='p-3'>
        <div className='flex justify-between items-center mb-4 gap-4'>
          <h2 className='text-center text-2xl uppercase'>{selectedSection?.name}</h2>

          <div className='flex gap-2'>
            <Button color='secondary' onClick={handleClose}>Cerrar</Button>
            <Button color='primary' onClick={toggleShowAssignField}>Añadir Campo</Button>
          </div>
        </div>
        <div className='border-b-2 mb-3'></div>
        <div className='mb-4'>
          {showAssignField && selectedSection && <AssignFieldForm section={selectedSection} fieldSections={fieldSections} close={toggleShowAssignField} onSuccess={addFieldSection}/>}
          {showUpdateField && selectedSection && selectedFieldSection && <UpdateFieldForm section={selectedSection} selectedFieldSection={selectedFieldSection} onClose={toggleShowUpdateField} onSuccess={updateFieldSection} />}
        </div>

        <FieldSectionsTable
          fieldSections={fieldSections}
          removeFieldSection={removeFieldSection}
          setSelectedFieldSection={setSelectedFieldSection}
          toggleFieldForm={toggleShowUpdateField}
        />

      </div>
    </Modal>
  )
}

export default SectionDetail

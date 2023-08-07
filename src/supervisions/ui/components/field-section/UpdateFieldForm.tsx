import React, { type ReactElement, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import { type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import { SupervisionSectionsService } from '@/supervisions/services/supervision-sections.service'
import { type FieldSectionDto, type FieldSection, FIELD_SECTION_DTO_INITIAL_STATE } from '@/supervisions/models/field-section.interface'
import { useDataForm } from '@/shared/hooks/useDataForm'
import SelectInput from '@/shared/ui/components/SelectInput'
import { PRIORITY } from '@/supervisions/models/enums/priority.enum'

interface UpdateFieldFormProps {
  section: SupervisionSection
  selectedFieldSection: FieldSection
  onClose: () => void
  onSuccess: (reportTypeField: FieldSection) => void
}

const UpdateFieldForm = ({ section, selectedFieldSection, onClose, onSuccess }: UpdateFieldFormProps): ReactElement => {
  const { toastId } = useContext(TemplateContext)

  const [sectionField, setFieldSectionValue, setFieldSection] = useDataForm<FieldSectionDto>(FIELD_SECTION_DTO_INITIAL_STATE)

  useEffect(() => {
    const { fieldId, sectionId, priority } = selectedFieldSection

    setFieldSection({
      fieldId,
      sectionId,
      priority
    })
  }, [selectedFieldSection])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const sectionsService = new SupervisionSectionsService()

    const fieldId = sectionField ? sectionField.fieldId : ''
    void sectionsService.updateField(section.id, fieldId, sectionField)
      .then((response) => {
        onSuccess(response)
        toast('Campo actualizado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        onClose()
      })
  }

  return (
    <div>
      <h2 className='text-center font-bold uppercase text-xl'>Editar campo</h2>
      <p className='font-medium text-red-dark text-center uppercase'>Campo: {selectedFieldSection?.field.name}</p>
      <form onSubmit={handleSubmit}>

        <SelectInput<string>
          label='Prioridad'
          name='priority'
          objects={Object.values(PRIORITY)}
          setValue={setFieldSectionValue}
          value={sectionField.priority}
        />

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Guardar</Button>
          <Button color='secondary' onClick={onClose}>Cerrar</Button>
        </div>
      </form>
    </div>
  )
}

export default UpdateFieldForm

import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import SelectInput from '@/shared/ui/components/SelectInput'
import Button from '@/shared/ui/components/Button'
import { useDataForm } from '@/shared/hooks/useDataForm'

import { FieldsService } from '@/fields/services/fields.service'
import { type Field } from '@/fields/models/field.interface'
import { type FieldSectionDto, type FieldSection, FIELD_SECTION_DTO_INITIAL_STATE } from '@/supervisions/models/field-section.interface'
import { type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import { PRIORITY } from '@/supervisions/models/enums/priority.enum'
import { FieldsSectionsService } from '@/supervisions/services/fields-sections.service'

interface AssignFieldFormProps {
  section: SupervisionSection
  fieldSections: FieldSection[]
  onSuccess: (fieldSection: FieldSection) => void
  close: () => void
}

const AssignFieldForm = ({ section, fieldSections, onSuccess, close }: AssignFieldFormProps): ReactElement => {
  const { toastId } = useContext(TemplateContext)
  const navigate = useNavigate()

  const [fields, setFields] = useState<Field[]>([])
  const [fieldSection, setFieldSectionValue] = useDataForm<FieldSectionDto>(FIELD_SECTION_DTO_INITIAL_STATE)
  const [selectedField, setSelectedField] = useState<Field | null>(null)

  useEffect(() => {
    const fieldsService = new FieldsService()
    const templatesService = new SupervisionTemplatesService()

    void fieldsService.findAll()
      .then(response => {
        const actualFields = fieldSections.map(fieldSection => fieldSection.fieldId)

        void templatesService.findAllFieldSections(section.templateId)
          .then(fieldSections => {
            const existingFieldSections = fieldSections.map(fieldSection => fieldSection.fieldId)
            const filteredFields = response.filter(field => (!actualFields.includes(field.id) && !existingFieldSections.includes(field.id)) && field.active)
            filteredFields.sort((a, b) => a.name.localeCompare(b.name))
            setFields(filteredFields)
          })
      })
  }, [])

  useEffect(() => {
    if (fields.length > 0) {
      setSelectedField(fields[0])
      setFieldSectionValue('fieldId', fields[0].id)
    }
  }, [fields])

  useEffect(() => {
    const field = fields.find(field => field.id === fieldSection.fieldId)
    setSelectedField(field ?? null)
  }, [fieldSection.fieldId])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const fieldsSection = new FieldsSectionsService()
    const fieldId = selectedField?.id ?? ''

    void fieldsSection.assignField(section.id, fieldId, fieldSection)
      .then((response) => {
        onSuccess(response)
        close()
        toast('Campo asignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const modal = (): ReactElement => (
    <>
      <h2 className='text-center font-bold uppercase text-xl'>Asignar campo</h2>
      <form onSubmit={handleSubmit}>
        <SelectInput<Field>
          label='Campo'
          name='fieldId'
          objects={fields}
          setValue={setFieldSectionValue}
          value={fieldSection.fieldId}
          optionKey='name'
          valueKey='id'
          searchable={true}
        />

        <SelectInput<string>
          label='Prioridad'
          name='priority'
          objects={Object.values(PRIORITY)}
          setValue={setFieldSectionValue}
          value={fieldSection.priority}
        />

        <div className='mt-5 flex justify-center gap-3 items-center'>
          <Button color='primary' type='submit'>Añadir</Button>
          <Button color='secondary' onClick={close} >Cancelar</Button>
        </div>
      </form>
    </>
  )

  const addFieldMessage = (): ReactElement => (
    <>
      <p className='text-center mb-3 text-lg'>Todos los campos están asignados, crea o activa algún campo si es que quieres asignar más</p>

      <div className='flex justify-center gap-3 items-center'>
        <Button color='primary' onClick={() => { navigate('/admin/campos') }}>Añadir campos</Button>
      </div>
    </>
  )

  return (
    fields.length > 0 ? modal() : addFieldMessage()
  )
}

export default AssignFieldForm

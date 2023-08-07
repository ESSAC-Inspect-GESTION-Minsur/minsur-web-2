import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { SECTION_DTO_INITIAL_STATE, type SupervisionSectionDto } from '@/supervisions/models/supervision-section.interface'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import { SectionContext } from '@/supervisions/ui/contexts/SectionContext'
import { SupervisionSectionsService } from '@/supervisions/services/supervision-sections.service'

interface SupervisionSectionFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const SectionFormModal = ({ isOpen, onClose }: SupervisionSectionFormModalProps): ReactElement => {
  const { toastId, selectedTemplate } = useContext(TemplateContext)
  const { sectionForm, setSectionForm, addSection, updateSection } = useContext(SectionContext)

  const [section, setSectionValue, setSection, reset] = useDataForm<SupervisionSectionDto>(SECTION_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    setSectionValue('templateId', selectedTemplate?.id ?? '')
    if (sectionForm === null) {
      setFormAction('add')
      return
    }

    const { name } = sectionForm
    setFormAction('update')

    setSection({
      name,
      templateId: selectedTemplate?.id ?? ''
    })
  }, [sectionForm, selectedTemplate])

  const handleCancel = (): void => {
    setSectionForm(null)
    reset()
    onClose()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const sectionsService = new SupervisionSectionsService()

    const submitAction = formAction === 'update' ? sectionsService.update : sectionsService.create
    const onSuccess = formAction === 'add' ? addSection : updateSection
    const id = formAction === 'update' ? sectionForm?.id ?? '' : selectedTemplate?.id ?? ''

    void submitAction(section, id)
      .then((response) => {
        onSuccess(response)
        reset()
        toast('Sección guardada correctamente', { toastId, type: 'success' })
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-3'>
        <h2 className='uppercase font-bold text-xl mb-3'>{formAction === 'add' ? 'Agregar sección al' : 'Editar sección del'} <span className='text-red'>checklist {selectedTemplate?.name}</span></h2>
        <form onSubmit={handleSubmit}>
          <Input
            label='Nombre de la sección'
            value={section.name}
            name='name' placeholder='Nombre' type='text'
            setValue={setSectionValue}></Input>

          <div className='mt-5 flex justify-center gap-3 items-center'>
            <Button color='primary' type='submit'>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
            <Button color='secondary' onClick={handleCancel}>Cerrar</Button>
          </div>
        </form>
      </div>
    </Modal>

  )
}

export default SectionFormModal

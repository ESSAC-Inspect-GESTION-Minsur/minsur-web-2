import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { type SupervisionTemplateDto, TEMPLATE_DTO_INITIAL_STATE } from '@/supervisions/models/supervision-template.interface'
import { SupervisionTemplatesService } from '@/supervisions/services/supervision-templates.service'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'

const SupervisionTemplateForm = (): ReactElement => {
  const { toastId, templateForm, setTemplateForm, addTemplate, updateTemplate } = useContext(TemplateContext)

  const [template, setTemplateValue, setTemplate, reset] = useDataForm<SupervisionTemplateDto>(TEMPLATE_DTO_INITIAL_STATE)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, toggleIsSubmitting, setIsSubmitting] = useBooleanState()

  useEffect(() => {
    setIsSubmitting(false)
    if (templateForm === null) {
      setFormAction('add')
      reset()
      return
    }

    const { name } = templateForm
    setFormAction('update')

    setTemplate({
      name
    })
  }, [templateForm])

  const handleCancel = (): void => {
    setTemplateForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    toggleIsSubmitting()
    const templatesService = new SupervisionTemplatesService()

    const submitAction = formAction === 'add' ? templatesService.create : templatesService.update
    const onSuccess = formAction === 'add' ? addTemplate : updateTemplate
    const id = templateForm?.id ?? ''

    void submitAction(template, id)
      .then((response) => {
        setTemplateForm(null)
        onSuccess(response)
        reset()

        toast(`Tipo de checklist ${formAction === 'add' ? 'añadidO' : 'guardadO'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'success' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div>
      <h2 className='font-bold uppercase'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de checklist</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          value={template.name}
          name='name' placeholder='Nombre checklist' type='text'
          setValue={setTemplateValue}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button className='py-1' color='secondary' onClick={handleCancel} >Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default SupervisionTemplateForm

import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { TEMPLATE_GROUP_DTO_INITIAL_STATE, type TemplateGroupDto } from '@/supervisions/models/template-group.interface'
import { TemplateGroupsService } from '@/supervisions/services/template-groups.service'
import { TemplateGroupContext } from '@/supervisions/ui/contexts/TemplateGroupContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'

const TemplateGroupForm = (): ReactElement => {
  const {
    templateGroupForm,
    selectedTemplateGroup,
    setTemplateGroupForm,
    setSelectedTemplateGroup,
    toastId,
    updateTemplateGroup,
    addTemplateGroup
  } = useContext(TemplateGroupContext)

  const [templateGroup, setTemplateGroupValue, setTemplateGroup, reset] = useDataForm<TemplateGroupDto>(TEMPLATE_GROUP_DTO_INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formAction, setFormAction] = useState<FormAction>('add')

  useEffect(() => {
    if (templateGroupForm === null) {
      setFormAction('add')
      return
    }

    const { name } = templateGroupForm
    setFormAction('update')

    setTemplateGroup({
      name
    })
  }, [templateGroupForm, selectedTemplateGroup])

  const handleCancel = (): void => {
    setTemplateGroupForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const templateGroupsService = new TemplateGroupsService()

    const submitFunction = formAction === 'add' ? templateGroupsService.create : templateGroupsService.update
    const onFinishSubmit = formAction === 'add' ? addTemplateGroup : updateTemplateGroup

    const id = templateGroupForm ? templateGroupForm.id : ''

    void submitFunction(templateGroup, id)
      .then(response => {
        onFinishSubmit(response)
        setSelectedTemplateGroup(response)
        setTemplateGroupForm(null)
        reset()
        toast(`Grupo ${formAction === 'add' ? 'agregado' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className='mt-2'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Grupo de Checklist</h2>
      <form onSubmit={handleSubmit}>
          <Input
            label='Nombre'
            value={templateGroup.name}
            name='name' placeholder='Nombre del grupo' type='text'
            setValue={setTemplateGroupValue}></Input>

        <div className='mt-5 flex gap-2'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default TemplateGroupForm

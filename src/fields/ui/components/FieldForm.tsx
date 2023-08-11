import React, { type ReactElement, useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { FieldContext } from '../contexts/FieldContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { FIELD_DTO_INITIAL_STATE, type FieldDto } from '@/fields/models/field.interface'
import { type FormAction } from '@/shared/types'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { FieldsService } from '@/fields/services/fields.service'
import Input from '@/shared/ui/components/Input'
import SelectInput from '@/shared/ui/components/SelectInput'
import { FieldType, FieldTypeText, TextFieldTypes } from '@/fields/models/enums/field-type.enum'
import Button from '@/shared/ui/components/Button'
import FieldValuesForm from './FieldValuesForm'

const FieldForm = (): ReactElement => {
  const { toastId, fieldForm, setFieldForm, addField, updateField } = useContext(FieldContext)
  const [field, setFieldValue, setField, reset] = useDataForm<FieldDto>(FIELD_DTO_INITIAL_STATE)

  const [formAction, setFormAction] = useState<FormAction>('add')
  const [isSubmitting,, setIsSubmitting] = useBooleanState()

  const [values, setValues] = useState<string[]>(fieldForm?.values ?? [])

  useEffect(() => {
    if (fieldForm === null) {
      setFormAction('add')
      return
    }

    const { name, type, placeholder, values } = fieldForm
    setFormAction('update')
    setValues(values)

    setField({
      name,
      type,
      placeholder,
      values
    })
  }, [fieldForm])

  const handleCancel = (): void => {
    setFieldForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const fieldsService = new FieldsService()

    const submitAction = formAction === 'add' ? fieldsService.create : fieldsService.update
    const onSuccess = formAction === 'add' ? addField : updateField
    const id = fieldForm?.id ?? ''

    field.values = values

    void submitAction(field, id)
      .then((response) => {
        setFieldForm(null)
        onSuccess(response)
        reset()

        toast(`Campos ${formAction === 'add' ? 'añadido' : 'guardado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className='mt-5'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Campo</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          value={field.name}
          name='name' placeholder='Nombre del campo' type='text'
          setValue={setFieldValue}></Input>

        <SelectInput<string>
          label='Tipo de campo'
          name='type'
          objects={Object.values(FieldType).map(type => FieldTypeText[type])}
          setValue={(name, value) => {
            setFieldValue(name, TextFieldTypes[value])
          }}
          value={FieldTypeText[field.type]}
        />

        {
          field.type === FieldType.LIST && formAction === 'update' && (
            <div className='mt-2'>
              <FieldValuesForm values={values} setValues={setValues}/>
            </div>
          )
        }

        {
          field.type === FieldType.TEXT && (
            <div className='mt-2'>
              <Input
                label='Descripción del campo'
                value={field.placeholder}
                required={false}
                name='placeholder' placeholder='Descripción del campo' type='text'
                setValue={setFieldValue} />
            </div>
          )
        }

        <div className='mt-4 flex gap-3'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
        </div>

      </form>
    </div>
  )
}

export default FieldForm

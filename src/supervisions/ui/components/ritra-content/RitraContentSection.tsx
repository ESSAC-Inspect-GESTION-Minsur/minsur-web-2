import React, { useState, type ReactElement, useEffect, type FormEvent, useRef } from 'react'
import { type RitraContentDto, type RitraContent } from '@/supervisions/models/ritra-content.interface'
import { RitraContentsService } from '@/supervisions/services/ritra-contents.service'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'

const RitraContentSection = (): ReactElement => {
  const [ritraContent, setRitraContent] = useState<RitraContent | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ritraContentService = new RitraContentsService()
    void ritraContentService.find()
      .then(setRitraContent)
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)

    const ritraContentForm: RitraContentDto = {
      content: formData.get('content') as string
    }

    const ritraContentService = new RitraContentsService()

    void ritraContentService.update(ritraContentForm)
      .then((ritraContent) => {
        setRitraContent(ritraContent)
        setIsEditing(false)
      })
  }

  const onEdit = (): void => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (!isEditing) return

    if (textAreaRef.current) {
      textAreaRef.current.value = ritraContent?.content ?? ''
    }

    textAreaRef.current?.focus()
  }, [isEditing])

  return (
    <div className='shadow-card p-3 rounded-md mb-4'>
      <div className='flex justify-between items-center'>
        <h2 className='uppercase font-semibold text-xl'>Contenido Ritra</h2>
        {!isEditing && <Button color='primary' onClick={onEdit}>Editar</Button>}
      </div>
      <Divider className='mt-2' />
      {
        !isEditing
          ? (<p>{ritraContent?.content}</p>)
          : (
            <form onSubmit={onSubmit}>

              <label className='block font-semibold mb-2' htmlFor="content">Editando contenido</label>
              <textarea
                ref={textAreaRef}
                id="content"
                name="content"
                className='w-full h-40 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />

              <div className='flex gap-2 mt-2'>
                <Button color='primary' type='submit' >Confirmar</Button>
                <Button color='secondary' onClick={() => { setIsEditing(false) }} >Cancelar</Button>
              </div>
            </form>
            )
      }
    </div>
  )
}

export default RitraContentSection

import React, { Fragment, useContext, type ReactElement } from 'react'
import { SectionContext } from '@/supervisions/ui/contexts/SectionContext'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'

import { type SupervisionSection } from '@/supervisions/models/supervision-section.interface'
import { SupervisionSectionsService } from '@/supervisions/services/supervision-sections.service'
import { toast } from 'react-toastify'

const SectionComponent = (): ReactElement => {
  const { toastId, selectedTemplate } = useContext(TemplateContext)
  const { sections, removeSection, setSelectedSection, toggleShowSectionDetail, setSectionForm, toggleShowSectionFormModal } = useContext(SectionContext)

  const handleShowDetail = (section: SupervisionSection): void => {
    setSelectedSection(section)
    toggleShowSectionDetail()
  }

  const handleUpdate = (section: SupervisionSection): void => {
    setSectionForm(section)
    toggleShowSectionFormModal()
  }

  const handleRemove = (section: SupervisionSection): void => {
    const result = confirm(`Estás seguro que quieres eliminar la sección ${section.name}`)
    if (!result) return

    const sectionsService = new SupervisionSectionsService()

    void sectionsService.remove(section.id)
      .then(() => {
        removeSection(section.id)
        toast('Sección eliminado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Fragment>
      {
        sections.length > 0
          ? (
            <div className='flex gap-4 flex-wrap'>
              {
                sections.map(section => (
                  <div key={section.id}
                    className='max-w-[220px] p-7 bg-black text-white rounded-lg flex flex-col justify-between gap-2'>
                    <p className='uppercase'>{section.name}</p>

                    <div className='flex justify-between gap-2 mt-3'>
                      <EyeIcon className='w-6 h-6 cursor-pointer hover:text-red' onClick={() => { handleShowDetail(section) } }></EyeIcon>
                      <EditIcon className='w-6 h-6 cursor-pointer' onClick={() => { handleUpdate(section) }} />
                      <DeleteIcon className='w-6 h-6 cursor-pointer text-red' onClick={() => { handleRemove(section) }} />
                    </div>
                  </div>
                ))
              }
            </div>
            )
          : (
            <p>{selectedTemplate !== null ? 'El tipo de checklist no tiene ninguna sección creada' : 'Seleccionar tipo de checklist'}</p>
            )
      }
    </Fragment>
  )
}

export default SectionComponent

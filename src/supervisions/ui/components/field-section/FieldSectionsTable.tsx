import { type FieldSection } from '@/supervisions/models/field-section.interface'
import React, { Fragment, useContext, type ReactElement } from 'react'
import { SectionContext } from '@/supervisions/ui/contexts/SectionContext'
import Table from '@/shared/ui/components/table/Table'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { SupervisionSectionsService } from '@/supervisions/services/supervision-sections.service'
import { toast } from 'react-toastify'
import { TemplateContext } from '@/supervisions/ui/contexts/TemplateContext'
import { type Action, type Column } from '@/shared/ui/components/table/types'

interface FieldSectionsTableProps {
  fieldSections: FieldSection[]
  toggleFieldForm: () => void
  setSelectedFieldSection: (fieldSection: FieldSection) => void
  removeFieldSection: (id: string) => void
}

const FieldSectionsTable = ({ fieldSections, toggleFieldForm, setSelectedFieldSection, removeFieldSection }: FieldSectionsTableProps): ReactElement => {
  const { toastId } = useContext(TemplateContext)
  const { selectedSection } = useContext(SectionContext)

  const handleRemove = (fieldSection: FieldSection): void => {
    if (selectedSection === null) return

    const result = confirm(`Estás seguro que quieres desasignar el campo ${fieldSection.field.name}`)
    if (!result) return

    const sectionsService = new SupervisionSectionsService()
    void sectionsService.deleteField(selectedSection.id, fieldSection.fieldId)
      .then(() => {
        removeFieldSection(fieldSection.id)
        toast('Campo desasignado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
      })
  }

  const handleUpdate = (fieldSection: FieldSection): void => {
    toggleFieldForm()
    setSelectedFieldSection(fieldSection)
  }

  const FIELD_SECTION_COLUMNS: Array<Column<FieldSection>> = [
    {
      id: 'name',
      columnName: 'Campo',
      filterFunc: (fieldSection) => fieldSection.field.name,
      render: (fieldSection) => fieldSection.field.name,
      sortFunc: (a, b) => a.field.name > b.field.name ? 1 : -1
    },
    {
      id: 'active',
      columnName: 'Activo',
      filterFunc: (fieldSection) => fieldSection.field.active ? 'activo' : 'no activo',
      render: (fieldSection) => fieldSection.field.active ? 'activo' : 'no activo',
      sortFunc: (a, b) => {
        const activeA = a.field.active ? 'activo' : 'no activo'
        const activeB = b.field.active ? 'activo' : 'no activo'

        return activeA > activeB ? 1 : -1
      }
    },
    {
      id: 'priority',
      columnName: 'Prioridad',
      filterFunc: (fieldSection) => fieldSection.priority,
      render: (fieldSection) => fieldSection.priority,
      sortFunc: (a, b) => a.priority.localeCompare(b.priority)
    }
  ]

  const FIELD_SECTION_ACTIONS: Array<Action<FieldSection>> = [
    {
      icon: () => (<EditIcon className='w-6 h-6 cursor-pointer'/>),
      actionFunc: handleUpdate
    },
    {
      icon: () => (<DeleteIcon className = 'w-6 h-6 cursor-pointer text-red' />),
      actionFunc: handleRemove
    }
  ]

  return (
    <Fragment>
      {
        fieldSections.length > 0
          ? (
            <Table
              columns={FIELD_SECTION_COLUMNS}
              data={fieldSections}
              actions={FIELD_SECTION_ACTIONS}
              pagination={[5, 10, 15]}
              />
            )
          : (
            <p>{selectedSection !== null ? 'No hay campos asignados al tipo de reporte' : 'Seleccionar tipo de reporte'}</p>
            )
      }
    </Fragment>

  )
}

export default FieldSectionsTable

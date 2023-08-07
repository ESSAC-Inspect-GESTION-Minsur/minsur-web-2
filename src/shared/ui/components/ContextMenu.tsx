import { type ContextMenuAction } from '@/shared/types'
import React, { useEffect, useRef } from 'react'
import DeleteIcon from '../assets/icons/DeleteIcon'

interface ContextMenuProps {
  xPos: number
  yPos: number
  onClose: () => void
  options: Record<ContextMenuAction, () => void>
}

const ContextMenu: React.FC<ContextMenuProps> = ({ xPos, yPos, options, onClose }) => {
  const contextMenuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [onClose])

  const handleOptionClick = (option: ContextMenuAction): void => {
    if (option in options) {
      options[option]()
    }
    onClose()
  }

  return (
    <ul
      ref={contextMenuRef}
      style={{
        position: 'fixed',
        top: yPos,
        left: xPos,
        backgroundColor: '#f0f0f0',
        listStyle: 'none',
        borderRadius: '4px',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
        zIndex: 9999
      }}
    >
      <li onClick={() => { handleOptionClick('delete') }}>
        <div className='flex gap-2 px-3 py-2 items-center cursor-pointer hover:bg-black hover:text-white transition-all duration-150 rounded-md'>
          <DeleteIcon className='w-5 h-5' />
          <span className='ml-2'>Eliminar</span>
        </div>
      </li>
    </ul>
  )
}

export default ContextMenu

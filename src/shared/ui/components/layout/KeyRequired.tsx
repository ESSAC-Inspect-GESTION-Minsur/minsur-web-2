import React, { useState, type ReactElement, useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'

const KEY = import.meta.env.VITE_WEB_KEY ?? ''

const KeyRequired = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const [allowed, setAllowed] = useState(true)

  useEffect(() => {
    const key = searchParams.get('key')

    if (key === null || key !== KEY) {
      setAllowed(false)
    }
  }, [])

  return (
    <div>
      {
        allowed
          ? <Outlet />
          : <h1>No tienes permisos</h1>
      }
    </div>
  )
}

export default KeyRequired

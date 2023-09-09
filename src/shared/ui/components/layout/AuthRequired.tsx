import React, { type ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthRequired = (): ReactElement => {
  const location = useLocation()
  return (
    <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default AuthRequired

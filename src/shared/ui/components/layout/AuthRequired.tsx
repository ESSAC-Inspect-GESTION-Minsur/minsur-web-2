import { isAuthenticated } from '@/shared/config/store/features/auth-slice'
import React, { type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AuthRequired = (): ReactElement => {
  const authenticated = useSelector(isAuthenticated)
  const location = useLocation()
  return (
    authenticated
      ? <Outlet />
      : <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default AuthRequired

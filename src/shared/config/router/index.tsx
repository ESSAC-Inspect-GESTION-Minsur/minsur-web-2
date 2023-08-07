import LoginView from '@/auth/ui/pages/LoginView'
import CheckpointsView from '@/checkpoints/ui/pages/CheckpointsView'
import FieldsView from '@/fields/ui/pages/FieldsView'
import CompaniesView from '@/companies/ui/pages/CompaniesView'
import ContractorsView from '@/companies/ui/pages/ContractorsView'
import DriversView from '@/users/ui/pages/DriversView'
import AdminRequired from '@/shared/ui/components/layout/AdminRequired'
import KeyRequired from '@/shared/ui/components/layout/KeyRequired'
import Layout from '@/shared/ui/components/layout/Layout'
import Redirect from '@/shared/ui/components/layout/Redirect'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import Home from '@/shared/ui/pages/Home'
import NotFound from '@/shared/ui/pages/NotFound'
import TermsAndConditions from '@/shared/ui/pages/TermsAndConditions'
import ProjectsView from '@/users/ui/pages/ProjectsView'
import UsersView from '@/users/ui/pages/UsersView'
import MaterialsView from '@/vehicles/ui/pages/MaterialsView'
import VehicleTypesView from '@/vehicles/ui/pages/VehicleTypesView'
import VehiclesView from '@/vehicles/ui/pages/VehiclesView'
import React from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import TemplateGroupView from '@/supervisions/ui/pages/TemplateGroupView'
import TemplatesView from '@/supervisions/ui/pages/TemplatesView'
import SupervisionsView from '@/supervisions/ui/pages/SupervisionsView'
import SupervisionDetail from '@/supervisions/ui/pages/SupervisionDetail'
import ConfigPage from '@/shared/ui/pages/ConfigPage'

const authRequiredRoutes: RouteObject[] = [
  {
    index: true,
    path: '',
    element: <Redirect />
  },
  {
    path: 'inicio',
    element: <Home />
  },
  {
    path: 'recorridos',
    element: <SupervisionsView />
  },
  {
    path: '',
    children: [
      {
        path: 'configuracion',
        element: <ConfigPage />
      }
    ]
  },
  {
    path: 'detalle-recorrido',
    element: <SupervisionDetail />
  },
  {
    path: 'detalle-checkpoints',
    element: <CheckpointsView />
  },
  {
    path: 'admin',
    element: <AdminRequired />,
    children: [
      {
        path: 'usuarios',
        element: <UsersView />
      },
      {
        path: 'reportes',
        element: <TemplatesView />
      },
      {
        path: 'grupos-reportes',
        element: <TemplateGroupView />
      },
      {
        path: 'campos',
        element: <FieldsView />
      },
      {
        path: 'tipo-vehiculos',
        element: <VehicleTypesView />
      },
      {
        path: 'vehiculos',
        element: <VehiclesView areCarts={false} />
      },
      {
        path: 'carretas',
        element: <VehiclesView areCarts={true} />
      },
      {
        path: 'tipo-materiales',
        element: <MaterialsView />
      },
      {
        path: 'empresas',
        element: <CompaniesView />
      },
      {
        path: 'conductores',
        element: <DriversView />
      },
      {
        path: 'proyectos',
        element: <ProjectsView />
      },
      {
        path: 'contratantes',
        element: <ContractorsView />
      }
    ]
  }
]

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: 'preview-detalle-recorrido',
    element: <KeyRequired/>,
    children: [
      {
        path: '',
        element: <SupervisionDetail isPreviewPage={true} />
      }
    ]
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: authRequiredRoutes
  },
  {
    path: '/terminos-y-condiciones',
    element: <TermsAndConditions />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router

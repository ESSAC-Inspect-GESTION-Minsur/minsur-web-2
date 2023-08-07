import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/shared/config/store/features/auth-slice'
import supervisionsReducer from '@/shared/config/store/features/supervisions-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    supervisions: supervisionsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

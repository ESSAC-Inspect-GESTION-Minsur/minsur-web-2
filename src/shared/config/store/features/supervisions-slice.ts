import { createAsyncThunk, createSlice, type SliceCaseReducers } from '@reduxjs/toolkit'
import { DateRange } from '@/shared/types/date-range'
import { type RootState } from '..'
import { type SUPERVISION_STATE, STATUS } from '../types'
import SupervisionsServices, { type FindAllOptions } from '@/supervisions/services/supervisions.service'
import { type Supervision } from '@/supervisions/models/supervision.interface'

const DEFAULT_STATE: SUPERVISION_STATE = {
  supervisions: [],
  dateRange: new DateRange(),
  lastRequest: null,
  status: STATUS.IDLE
}

const getSupervisionsFromJson = (supervisionsJson: string): SUPERVISION_STATE => {
  const supervisionsJsonObject = JSON.parse(supervisionsJson)
  const lastDate = supervisionsJsonObject.lastRequest

  return {
    supervisions: supervisionsJsonObject.supervisions,
    dateRange: DateRange.fromJson(supervisionsJsonObject.dateRange),
    lastRequest: lastDate ? new Date(lastDate) : new Date(),
    status: STATUS.SUCCEEDED
  }
}

const getInitialState = (): SUPERVISION_STATE => {
  const supervisionsJson = sessionStorage.getItem('supervisions-request')
  if (!supervisionsJson) {
    return DEFAULT_STATE
  }
  return getSupervisionsFromJson(supervisionsJson)
}

const INITIAL_STATE: SUPERVISION_STATE = getInitialState()

export const findAllSupervisions = createAsyncThunk('findAllSupervisions', async (options: FindAllOptions, thunkAPI) => {
  const supervisionsServices = new SupervisionsServices()
  return await supervisionsServices.findAll(options)
    .then((response) => response)
    .catch((error) => {
      return thunkAPI.rejectWithValue(error)
    })
})

const supervisionsSlice = createSlice<SUPERVISION_STATE, SliceCaseReducers<SUPERVISION_STATE>>({
  name: 'supervisions',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers (builder) {
    builder
      .addCase(findAllSupervisions.pending, (state, action) => {
        state.status = STATUS.PENDING
      })
      .addCase(findAllSupervisions.fulfilled, (state, action) => {
        state.supervisions = action.payload

        const supervisionJson = JSON.parse(sessionStorage.getItem('supervisions-request') ?? '')

        state.lastRequest = supervisionJson.lastRequest ? new Date(supervisionJson.lastRequest) : new Date()
        state.dateRange = supervisionJson.dateRange ? DateRange.fromJson(supervisionJson.dateRange) : new DateRange()
        state.status = STATUS.SUCCEEDED
      })
      .addCase(findAllSupervisions.rejected, (state, action) => {
        state.status = STATUS.FAILED
      })
  }
})

export const getSupervisions = ({ supervisions }: RootState): Supervision[] => supervisions.supervisions
export const getDateRange = ({ supervisions }: RootState): DateRange => supervisions.dateRange
export const getLastDateRequest = ({ supervisions }: RootState): Date | null => supervisions.lastRequest
export const getStatus = ({ supervisions }: RootState): STATUS => supervisions.status

export default supervisionsSlice.reducer

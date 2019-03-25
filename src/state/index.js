import { currentUserSlice } from './current-user'
import { createStoreFromSlices } from '../utils'

const store = createStoreFromSlices([
  currentUserSlice,
])


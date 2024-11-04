import { configureStore } from '@reduxjs/toolkit'
import matrixReducer from './redux/MatrixSlice'
import configReducer from './redux/ConfigSlice'
import matrixSyncReducer from './redux/MatrixSyncSlice'
export default configureStore({
  reducer: {
    config: configReducer,
    matrix: matrixReducer,
    matrixSync: matrixSyncReducer,
    }
})
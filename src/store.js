import { configureStore } from '@reduxjs/toolkit'
import matrixReducer from './redux/MatrixSlice'
import configReducer from './redux/ConfigSlice'
export default configureStore({
  reducer: {
    config: configReducer,
    matrix: matrixReducer,
    }
})
import { createSlice } from '@reduxjs/toolkit'

export const matrixSyncSlice = createSlice({
  name: 'matrixSync',
  initialState: {
    hoveredCell: {},
  },
  reducers: {
    updateHoveredCell: (state, action) => {
      return {...state, hoveredCell:action.payload};
    },
  }
})

// Action creators are generated for each case reducer function
export const { updateHoveredCell} = matrixSyncSlice.actions

export default matrixSyncSlice.reducer
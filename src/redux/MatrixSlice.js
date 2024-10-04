import { createSlice } from '@reduxjs/toolkit'
import { genGridData } from "../utils/helper";

function getColLabels(data){
    const colLabels=[]
    data.forEach((dataItem)=>{colLabels[dataItem.colPos]=dataItem.colLabel})
    return colLabels;
}
function getRowLabels(data){
    const rowLabels=[]
    data.forEach((dataItem)=>{rowLabels[dataItem.rowPos]=dataItem.rowLabel})
    return rowLabels;
}
function generateNewData(nbRows,nbCols){
    const initGenData = genGridData(nbRows,nbCols);
    return {genData:initGenData, rowLabels: getRowLabels(initGenData), colLabels:getColLabels(initGenData)}
}

export const matrixSlice = createSlice({
  name: 'matrix',
  initialState: generateNewData(4,4),
  reducers: {
    generateByGenConfig: (state, action) =>{
        return generateNewData(action.payload.nbRows,action.payload.nbCols)
    },
    updateSelectedItem: (state, action) => {
        const newGenData = state.genData.map(cellData => {
            if (cellData.index === action.payload.index) {
            return {...cellData,selected:!cellData.selected};
            } else {
            return cellData;
            }
        })
        return {...state, genData:newGenData};
    },
  }
})

// Action creators are generated for each case reducer function
export const { generateByGenConfig, updateSelectedItem } = matrixSlice.actions

export default matrixSlice.reducer
import { createContext, useReducer } from "react";
import { genGridData } from "../utils/helper";

export const MatrixDataContext = createContext(null);
export const MatrixDataDispatchContext = createContext(null);

export function MatrixDataContextProvider({children}){
    const [genData, dispatch] = useReducer(
        matrixDataReducer,
        initMatrixData
      );
    
    return(
        <MatrixDataContext.Provider value={genData}>
            <MatrixDataDispatchContext.Provider value={dispatch}>
                {children}
            </MatrixDataDispatchContext.Provider>
        </MatrixDataContext.Provider>
    )
};

function matrixDataReducer(matrixData, action){
    switch (action.type) {
        case 'generate': {
          return generateNewData(action.nbRows,action.nbCols);
        }
        case 'updateSelectedItem': {
            const newGenData = matrixData.genData.map(cellData => {
                if (cellData.index === action.cellData.index) {
                return {...cellData,selected:!cellData.selected};
                } else {
                return cellData;
                }
            })
          return {
            genData: newGenData,
            colLabels: getColLabels(newGenData),
            rowLabels: getRowLabels(newGenData),
          };
        }
        default: {
          throw Error('Unknown action for matrixDataReducer: ' + action.type);
        }
      }
    
}

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
const initMatrixData = generateNewData(4,4);
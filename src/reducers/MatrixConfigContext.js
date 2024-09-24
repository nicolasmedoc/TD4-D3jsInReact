import { createContext, useReducer } from "react";

export const MatrixConfigContext = createContext(null);
export const MatrixConfigDispatchContext = createContext(null);

export function MatrixConfigContextProvider({children}){
    const [genConfig, dispatch] = useReducer(
        matrixConfigReducer,
        {nbCols:4, nbRows:4, hoveredCell:{}}
      );
    
    return(
        <MatrixConfigContext.Provider value={genConfig}>
            <MatrixConfigDispatchContext.Provider value={dispatch}>
                {children}
            </MatrixConfigDispatchContext.Provider>
        </MatrixConfigContext.Provider>
    )
};

function matrixConfigReducer(genConfig, action){
    switch (action.type) {
      case 'updateNbRowsAndCols':{
        return {...genConfig, nbRows:action.nbRows, nbCols:action.nbCols};
      }
      case 'updateHoveredCell':{
        return {...genConfig, hoveredCell: action.hoveredCell}
      }
      default: {
        throw Error('Unknown action for genConfigReducer: ' + action.type);
      }
    }
  }
  export default matrixConfigReducer;

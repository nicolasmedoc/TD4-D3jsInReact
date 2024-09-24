import './Matrix.css'
import { getDefaultFontSize} from '../../utils/helper';
import { useEffect, useContext, useRef } from 'react';
import { MatrixConfigDispatchContext } from '../../reducers/MatrixConfigContext';
import { MatrixDataContext, MatrixDataDispatchContext } from '../../reducers/MatrixDataContext';
import MatrixD3 from './Matrix-d3';

const cellSize= 34;
const fontSize=getDefaultFontSize()


function Matrix(){
    const matrixData = useContext(MatrixDataContext);
    const dataDispatch = useContext(MatrixDataDispatchContext)
    const configDispatch = useContext(MatrixConfigDispatchContext)

    useEffect(()=>{
        console.log("Matrix useEffect (called each time matrix re-renders)");
    }); // if no dependencies, useEffect is called at each re-render

    const divContainerRef=useRef(null);
    const matrixD3Ref = useRef(null)

    const getCharSize = function(){
        return {width:900, height:900};
    }

    // did mount
    useEffect(()=>{
        console.log("Matrix useEffect [] called once matrix did mount");
        const matrixD3 = new MatrixD3(divContainerRef.current);
        matrixD3.create({size:getCharSize()});
        matrixD3Ref.current = matrixD3;
        return ()=>{
            // did unmout
            console.log("Matrix useEffect [] return function, called when component did unmount...");
            const matrixD3 = matrixD3Ref.current;
            matrixD3.clear()
        }
    },[]);// if empty array, useEffect is called after the component did mount, has been created

    // did update
    useEffect(()=>{
        console.log("Matrix useEffect with dependency [matrixData,dataDispatch,configDispatch], called each time matrixData changes...");
        const matrixD3 = matrixD3Ref.current;

        const handleOnClick = function(cellData){
            dataDispatch({type:"updateSelectedItem", cellData})
        }
        const handleOnMouseEnter = function(cellData){
            configDispatch({type:"updateHoveredCell", hoveredCell:cellData})
        }
        const handleOnMouseLeave = function(){
            configDispatch({type:"updateHoveredCell", hoveredCell:{}})
        }
        const controllerMethods={
            handleOnClick,
            handleOnMouseEnter,
            handleOnMouseLeave
        }
        matrixD3.renderMatrix(matrixData,controllerMethods);
    },[matrixData,dataDispatch,configDispatch]);// if dependencies, useEffect is called after each data update, in our case only matrixData changes.

    return(
        <div ref={divContainerRef} className="matrixDivContainer">

        </div>
    )
}

export default Matrix;
import './Matrix.css'
import { useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { updateSelectedItem } from '../../redux/MatrixSlice';
import { updateHoveredCell } from '../../redux/ConfigSlice';

import MatrixD3 from './Matrix-d3';

function Matrix(){
    const matrixData = useSelector(state =>state.matrix)
    const dispatch = useDispatch();

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
            dispatch(updateSelectedItem(cellData));
        }
        const handleOnMouseEnter = function(cellData){
            dispatch(updateHoveredCell(cellData))
        }
        const handleOnMouseLeave = function(){
            dispatch(updateHoveredCell({}))
        }
        const controllerMethods={
            handleOnClick,
            handleOnMouseEnter,
            handleOnMouseLeave
        }
        matrixD3.renderMatrix(matrixData,controllerMethods);
    },[matrixData,dispatch]);// if dependencies, useEffect is called after each data update, in our case only matrixData changes.

    return(
        <div ref={divContainerRef} className="matrixDivContainer">

        </div>
    )
}

export default Matrix;
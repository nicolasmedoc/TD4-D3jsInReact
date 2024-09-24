import './App.css';
import Matrix from './components/matrix/Matrix';
import ControlBar from './components/ControlBar/ControlBar';
import { useEffect } from 'react';
import { MatrixDataContextProvider } from './reducers/MatrixDataContext';
import { MatrixConfigContextProvider } from './reducers/MatrixConfigContext';
// here import other dependencies

// a component is a piece of code which render a part of the user interface
function App() {

  useEffect(()=>{
    console.log("App useEffect");
  })

  return (
    <MatrixConfigContextProvider>
      <MatrixDataContextProvider>

        <div className="App">
            {console.log("App rendering")}
            <div id="control-bar-container">
              <ControlBar/>
            </div>  
            <div id="view-container">
              <Matrix/>
            </div>
        </div>
      </MatrixDataContextProvider>
    </MatrixConfigContextProvider>
  );
}

export default App;

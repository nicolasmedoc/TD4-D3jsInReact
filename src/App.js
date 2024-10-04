import './App.css';
import Matrix from './components/matrix/Matrix';
import ControlBar from './components/ControlBar/ControlBar';
import { useEffect} from 'react';

// here import other dependencies

// a component is a piece of code which render a part of the user interface
function App() {
  useEffect(()=>{
    console.log("App useEffect");
  })

  return (
    <div className="App">
        {console.log("App rendering")}
        <div id="control-bar-container">
          <ControlBar/>
        </div>  
        <div id="view-container">
          <Matrix/>
        </div>
    </div>
  );
}

export default App;

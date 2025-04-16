import logo from './logo.svg';
import './App.css';
import Expensetable from './components/Expensetable';
import Addexpense from './components/Addexpense';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Expensetable/>}/>
          <Route path="/add" element={<Addexpense/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;

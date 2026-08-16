import Signup from './pages/Signup';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './pages/Signin';
import Dashboard from "./pages/Dashboard";
import Organizations from './pages/Organizations';
import Organizationboard from './pages/Organizationboard';
import Board from "./pages/Board";
function App() {
  return (
     <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/organizations" element={<Organizations />} />
              <Route  path="/organizations/:organizationId/boards" element={<Organizationboard  />} />
               <Route path="/organizations/:organizationId/boards/:boardId" element={<Board />}/>
      
    </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;

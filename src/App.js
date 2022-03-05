import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Waitlist from "./pages/Waitlist";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/doctor" element={<Waitlist />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/"/>} />
    </Routes>
  );
}

export default App;


// default 2 
// routing update
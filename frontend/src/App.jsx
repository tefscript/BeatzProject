import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "@/components/login/Login";
import SignUp from "@/components/signup/SignUp";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
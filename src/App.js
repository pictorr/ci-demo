import "./App.css";
import { Routes, Route } from "react-router-dom";
import DefaultMenu from "./components/DefaultMenu";
import HomePage from "./pages/HomePage";
import RegisterForm from "./pages/RegisterForm";

function App() {
  return (
    <div>
      <DefaultMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
        <Route path='register' element={<RegisterForm />} />
      </Routes>
    </div>
  );
}

export default App;

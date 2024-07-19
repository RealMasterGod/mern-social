import { useContext, useEffect } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login"
import Profile from "./pages/profile/Profile"
import Register from "./pages/register/Register"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import { useState } from "react";
import axios from "axios";

function App() {
  const {user} = useContext(AuthContext)
  // const [test,setTest] = useState("Bye")
  // useEffect(() => {
  //   const testFunc = async () => {
  //     try {
  //       const res = await axios.get("https://mern-social-api-git-main-realmastergods-projects.vercel.app/api")
  //       setTest(res.data)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   testFunc()
  // },[])
  return (
    // <>
    // <h1>{test}</h1>
    // </>
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <Home /> : <Register />} />
        {/* <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" />: <Register/>} />
        <Route path="/messenger" element={!user ? <Navigate to="/" />: <Messenger/>} />
        <Route path="/profile/:username" element={<Profile />} /> */}
      </Routes>
    </Router>
  )
}

export default App;

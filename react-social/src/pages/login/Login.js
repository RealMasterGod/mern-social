import "./login.css"
import { useContext, useRef } from "react"
import { loginCall } from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress } from "@mui/material"
import { Link } from "react-router-dom"

export default function Login() {

    const email = useRef()
    const password = useRef()

    const {user,isFetching, error, dispatch} = useContext(AuthContext) 

    const handleClick = (e) => {
        e.preventDefault()
        loginCall({email: email.current.value,password: password.current.value},dispatch)
    }


    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">MySocialApp</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around youon MySocialApp.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}> 
                        <input placeholder="Email" type="email" className="loginInput" ref={email} required/>
                        <input placeholder="Password" type="password" minLength="4" className="loginInput" ref={password} required/>
                        <button className="loginButton" type="submit" disabled={isFetching} >{isFetching ? <CircularProgress color="inherit" />:"Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <Link to="/register" style={{color: 'inherit', textDecoration: 'none'}}>
                        <button type="button" className="loginRegisterButton" style={{width: '100%'}}>
                            {isFetching ? <CircularProgress color="inherit" />:"Create a New Account"}
                        </button>
                        </Link>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

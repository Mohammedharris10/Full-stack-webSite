import { useDispatch } from "react-redux";
import { login } from "../../actions/userActions";
import MetaData from "../layouts/MetaData";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { clearAuthError } from "../../actions/userActions";


export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let {loading, error,isAuthicated} = useSelector(state => state.authState)

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(login(email, password))
    }

    useEffect(()=>{
        if(isAuthicated){ // if login successful it will naviagte to home page
            navigate("/")
        }
        if(error){
            toast(error, {
                position: "bottom-center",
                type: "error",
                onOpen: () => dispatch(clearAuthError()), // Clear error on toast open
            });
            
        }
        
    }, [error,isAuthicated, navigate, dispatch])

    

    return (
        <>
            <MetaData title={"Login"} />
            <div className="row wrapper">

                <div className="col-10 col-lg-4">

                    <form className="shadow-lg p-4" onSubmit ={submitHandler}>

                        <h1 className="mb-3">Login</h1>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value = {email}
                                onChange = {(event)=> setEmail(event.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group mt-3">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange = {(event)=> setPassword(event.target.value)}
                            />
                        </div>

                        <a href="#" className="float-end mt-2 small text-muted">
                            Forgot Password?
                        </a>

                        <button
                            type="submit"
                            className="btn w-100 mt-4 text-white login-btn"
                            disabled = {loading}
                        >
                            LOGIN
                        </button>

                        <p className="text-end mt-3 small text-muted">
                            New User?
                        </p>

                    </form>

                </div>

            </div>
        </>
    )
}
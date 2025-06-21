import { useState } from 'react'
import './index.css'
import axois from "axios"
import { useNavigate } from 'react-router-dom'
function Signup() {
    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")

    const navigate = useNavigate()
    const onSubmitForm = async (e) => {
        e.preventDefault()
        const response = await axois.post("https://paytm-t9yo.onrender.com/user/v1/signup", { username: username, password: pass })
        console.log(response)
    }
    const onclicklogin = () => {
        navigate("/login")
    }
    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Create Account</h1>
                    <p>Join us today and start managing your finances</p>
                </div>

                <form className="signup-form" onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>


                    <button type="submit" className="signup-button">
                        Create Account
                    </button>
                </form>

                <div className="signup-footer">
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className="login-link" onClick={onclicklogin}>
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup

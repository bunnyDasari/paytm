import { useState } from 'react'
import './index.css'
import axois from "axios"
import { useNavigate } from 'react-router-dom'
import cookies from "js-cookie"
function Login() {
    const [username, setUsername] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const onSubmitForm = async (e) => {
        e.preventDefault()
        const response = await axois.post("http://localhost:3001/user/v1/login", { username: username, password: pass })
        console.log(response.data.username)
        if (response.data.token) {
            cookies.set("jwt_token", response.data.token, { expires: 2 })
            cookies.set("user", response.data.username, { expires: 2 })
            navigate("/dash")
        } else {
            setError(response.data.msg)
            setShowError(!showError)
        }
    }
    const onclickcreate = (e) => {
        e.preventDefault()
        navigate("/signup")
    }
    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Login</h1>
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
                        login
                    </button>
                </form>
                {showError && <p>{error}!!</p>}
                <div className="signup-footer">
                    <p>
                        create a account?{' '}
                        <a href="/login" className="login-link" onClick={onclickcreate}>
                            Signup here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login

import { useState } from 'react'
import LoginForm from '../components/loginform'
function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    return (
      <div className='container-fluid py-4'>
        <div className='row'>
          <div className='col-md-4'>
            {isLoggedIn ? (
              <h1>Welcome back</h1>
            ) : (
              <LoginForm onLogin={() => setIsLoggedIn(true)} />
            )}
          </div>
        </div>
      </div>
    )
}

export default Login
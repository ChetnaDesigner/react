import PropTypes from 'prop-types'

function LoginForm({ onLogin }) {
    return (
        <div>
            <h1>Please Login</h1>
            <input type="text" placeholder="Username" className='form-control' />
            <br/>
            <input type="password" placeholder="Password" className='form-control' />
            <br/>
            <button
              type="button"
              onClick={() => {
                alert('Login successful')
                onLogin?.()
              }}
              className='btn btn-primary'
            >
              Login
            </button>
        </div>
    )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func,
}

export default LoginForm
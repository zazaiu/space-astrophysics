import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginAsync } from '../store/authSlice'
import type { AppDispatch, RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!username || !password) return alert('Введите username и пароль')
    try {
      await dispatch(loginAsync({ username, password })).unwrap()
      navigate('/planets', { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth-frame">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </div>
  )
}

export default Login

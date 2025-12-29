import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerAsync } from '../store/authSlice'
import type { AppDispatch, RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'guest' | 'astronaut' | 'mission_control'>('guest')

  const handleRegister = async () => {
    if (!username || !password) return alert('Введите username и пароль')
    try {
      await dispatch(registerAsync({ username, password, role })).unwrap()
      navigate('/planets', { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth-frame">
      <h2>Register</h2>
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
      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="guest">Guest</option>
        <option value="astronaut">Astronaut</option>
        <option value="mission_control">Mission Control</option>
      </select>
      {error && <p className="error">{error}</p>}
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Register'}
      </button>
    </div>
  )
}

export default Register

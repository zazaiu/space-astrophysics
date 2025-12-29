import React from 'react'
import { useAppSelector } from '../store/hooks'

export const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <div style={{ color: '#fff', padding: '20px' }}>Пользователь не авторизован</div>
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Профиль пользователя</h2>
      <div style={{ color: '#fff', marginBottom: '15px' }}>
        <strong>Имя пользователя:</strong> {user.username}
      </div>
      <div style={{ color: '#fff', marginBottom: '15px' }}>
        <strong>Роль:</strong> {user.role}
      </div>
      <div style={{ color: '#fff', marginBottom: '15px' }}>
        <strong>ID:</strong> {user.id}
      </div>
    </div>
  )
}
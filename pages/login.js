import { useState } from 'react'
import Layout from '../src/components/Layout'
import ThemeToggle from '../src/components/ThemeToggle'
import LoginView from '../src/components/Login/Login'
import RegisterView from '../src/components/Register/Register'
import Notification from '../src/components/Notification/Notification'
import Router from 'next/router'
import { handleJwtToken } from '../utils/clientHelpers'

export default function Login() {
  const [loginView, setLoginView] = useState(true)
  const [email, setEmail] = useState('')

  const toggleLoginView = (state = undefined) => {
    const cmd = state === undefined ? !loginView : state
    setLoginView(cmd)
  }

  const handleLogin = data => {
    handleJwtToken(data.token)
    Router.push('/')
  }

  const handleEmail = email => setEmail(email)

  return (
    <Layout>
      <div className='absolute top-0 right-0 z-50 p-4 text-2xl hover:text-highlight-400'>
        <ThemeToggle />
      </div>
      <div className='flex items-center justify-center h-screen'>
        {loginView ? (
          <LoginView
            toggleLoginView={toggleLoginView}
            handleLogin={handleLogin}
            handleEmail={handleEmail}
          />
        ) : (
          <RegisterView
            toggleLoginView={toggleLoginView}
            handleLogin={handleLogin}
            email={email}
          />
        )}
      </div>

      <Notification />
    </Layout>
  )
}

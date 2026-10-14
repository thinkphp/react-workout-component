import { useState, useEffect } from 'react'
import WorkoutCalendar from './WorkoutCalendar.jsx'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('wc-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('wc-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div className="app-wrapper">
      <WorkoutCalendar theme={theme} onToggleTheme={toggleTheme} />
    </div>
  )
}

export default App

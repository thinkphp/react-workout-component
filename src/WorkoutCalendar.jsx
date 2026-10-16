import { useState, useEffect } from 'react'
import './WorkoutCalendar.css'

const EXERCISES = [
  { key: 'pushups',  label: 'Push-ups', icon: '💪', color: '#f97316' },
  { key: 'pullups',  label: 'Pull-ups', icon: '🏋️', color: '#8b5cf6' },
  { key: 'abs',      label: 'Abs',      icon: '🔥', color: '#ef4444' },
  { key: 'squats',   label: 'Squats',   icon: '🦵', color: '#3b82f6' },
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WorkoutCalendar = ({ theme = 'dark', onToggleTheme }) => {
  const [workouts, setWorkouts] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({ pushups: 0, pullups: 0, abs: 0, squats: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('workoutData')
    if (saved) {
      setWorkouts(JSON.parse(saved).map(w => ({ squats: 0, ...w })))
    }
  }, [])

  /* ── helpers ── */
  const getTotal = (workout) =>
    workout
      ? Object.values(workout).filter(v => typeof v === 'number').reduce((s, v) => s + v, 0)
      : 0

  const getIntensityClass = (workout) => {
    const t = getTotal(workout)
    if (t === 0) return ''
    if (t > 150) return 'intensity-high'
    if (t > 75)  return 'intensity-mid'
    return 'intensity-low'
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  /* ── month stats ── */
  const monthStats = () => {
    const prefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    const monthWorkouts = workouts.filter(w => w.date.startsWith(prefix))
    return EXERCISES.map(ex => ({
      ...ex,
      total: monthWorkouts.reduce((s, w) => s + (Number(w[ex.key]) || 0), 0),
    }))
  }

  /* ── calendar grid ── */
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // day of week the 1st falls on (Mon=0 … Sun=6)
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

    const cells = []

    // empty cells before the 1st
    for (let i = 0; i < firstDow; i++) {
      cells.push(<div key={`empty-${i}`} className="day-cell day-cell-empty" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const workout = workouts.find(w => w.date === date)
      const total = getTotal(workout)

      cells.push(
        <div
          key={date}
          className={`day-cell ${isToday(day) ? 'day-cell-today' : ''} ${getIntensityClass(workout)}`}
          onClick={() => openModal(date)}
          role="button"
          aria-label={`${date}${workout ? ` – ${total} reps` : ''}`}
        >
          <span className="day-number">{day}</span>
          {workout && (
            <div className="day-summary">
              {EXERCISES.filter(ex => Number(workout[ex.key]) > 0).map(ex => (
                <span key={ex.key} className="day-pill" title={`${ex.label}: ${workout[ex.key]}`}>
                  {ex.icon}
                  <span>{workout[ex.key]}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )
    }

    return cells
  }

  /* ── modal ── */
  const openModal = (date) => {
    setSelectedDate(date)
    const workout = workouts.find(w => w.date === date) || { pushups: 0, pullups: 0, abs: 0, squats: 0 }
    setFormData({ pushups: 0, pullups: 0, abs: 0, squats: 0, ...workout })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  const saveWorkout = () => {
    const workout = { date: selectedDate, ...formData }
    const updated = workouts.some(w => w.date === selectedDate)
      ? workouts.map(w => (w.date === selectedDate ? workout : w))
      : [...workouts, workout]
    setWorkouts(updated)
    localStorage.setItem('workoutData', JSON.stringify(updated))
    closeModal()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleInput = (key, value) => {
    const num = Math.max(0, parseInt(value) || 0)
    setFormData(prev => ({ ...prev, [key]: num }))
  }

  const stats = monthStats()

  return (
    <div className="wc-container">
      {/* ── header ── */}
      <header className="wc-header">
        <div className="wc-logo">
          <span className="wc-logo-icon">🏃</span>
          
<span className="wc-logo-text">
  WorkoutTracker 
</span>

        </div>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>
      </header>

      {/* ── month stats bar ── */}
      <section className="wc-stats">
        {stats.map(ex => (
          <div key={ex.key} className="stat-card">
            <span className="stat-icon">{ex.icon}</span>
            <div>
              <div className="stat-value">{ex.total.toLocaleString()}</div>
              <div className="stat-label">{ex.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── calendar ── */}
      <section className="wc-calendar-wrap">
        {/* nav */}
        <div className="wc-nav">
          <button
            className="wc-nav-btn"
            onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            ‹
          </button>
          <h2 className="wc-month-title">
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            className="wc-nav-btn"
            onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* day names */}
        <div className="calendar-grid">
          {DAY_NAMES.map(d => (
            <div key={d} className="day-name">{d}</div>
          ))}
          {renderCalendarDays()}
        </div>
      </section>

      {/* ── legend ── */}
      <div className="wc-legend">
        <span className="legend-item"><span className="legend-dot dot-low" />Light (&lt;75)</span>
        <span className="legend-item"><span className="legend-dot dot-mid" />Medium (75–150)</span>
        <span className="legend-item"><span className="legend-dot dot-high" />Intense (&gt;150)</span>
      </div>
      <br/>
      <span className="legend-dot dot-low">
Designed & developed by Adrian Statescu
       </span>


      {/* ── modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              <span>📅</span>
              <span>{selectedDate}</span>
            </div>
            <p className="modal-subtitle">Log your workout for today</p>

            <div className="modal-fields">
              {EXERCISES.map(ex => (
                <label key={ex.key} className="field-row">
                  <span className="field-icon">{ex.icon}</span>
                  <span className="field-label">{ex.label}</span>
                  <div className="field-stepper">
                    <button
                      className="stepper-btn"
                      onClick={() => handleInput(ex.key, formData[ex.key] - 1)}
                      aria-label={`Decrease ${ex.label}`}
                    >−</button>
                    <input
                      type="number"
                      min="0"
                      value={formData[ex.key]}
                      onChange={e => handleInput(ex.key, e.target.value)}
                      className="stepper-input"
                      aria-label={ex.label}
                    />
                    <button
                      className="stepper-btn"
                      onClick={() => handleInput(ex.key, formData[ex.key] + 1)}
                      aria-label={`Increase ${ex.label}`}
                    >+</button>
                  </div>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={saveWorkout}>Save Workout</button>
            </div>
          </div>
        </div>
      )}

      {/* ── toast ── */}
      {showToast && (
        <div className="toast" role="status" aria-live="polite">
          <span>✅</span>
          <span>Workout saved!</span>
          <button className="toast-close" onClick={() => setShowToast(false)} aria-label="Dismiss">×</button>
        </div>
      )}
    </div>
  )
}

export default WorkoutCalendar

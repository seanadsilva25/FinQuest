import SIPCalculator from './pages/Learning/SIPCalculator'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <h2>FinQuest <span>Learning</span></h2>
        </div>
      </header>
      <main className="app-main">
        <SIPCalculator />
      </main>
    </div>
  )
}

export default App

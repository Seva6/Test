import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

// Snowflake component for Christmas mode
const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState([])

  useEffect(() => {
    const flakes = []
    const snowSymbols = ['❄', '❅', '❆', '✻', '✼', '❉']
    
    for (let i = 0; i < 30; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 5 + Math.random() * 10,
        symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)],
        size: 0.8 + Math.random() * 1.2
      })
    }
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map(flake => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            fontSize: `${flake.size}rem`
          }}
        >
          {flake.symbol}
        </span>
      ))}
    </div>
  )
}

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { christmasMode } = useTheme()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Christmas Snowflakes */}
      {christmasMode && <Snowflakes />}
      
      {/* Christmas Banner */}
      {christmasMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white text-center py-1 text-sm font-medium">
          🎄 Happy Holidays! 🎅 Wishing you a wonderful season! ❄️
        </div>
      )}
      
      {/* Navbar */}
      <div className={christmasMode ? 'mt-7' : ''}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      </div>
      
      {/* Sidebar for desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className={`lg:pl-64 pt-16 pb-20 lg:pb-0 ${christmasMode ? 'mt-7' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation for mobile */}
      <BottomNav />
    </div>
  )
}

export default Layout

// Vanilla JS entry for StudentStudy
// Modern dark-themed app using localStorage service
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  createUser,
  getUsers,
  getAssignmentsByUser,
  createAssignment,
  deleteAssignment,
  getGradesByUser,
  createGrade,
  seedDemoData
} from './services/localStorage.js'

const root = document.getElementById('root')

// Helper to create elements
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag)
  Object.entries(props).forEach(([k, v]) => {
    if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v)
    } else if (k === 'class') {
      node.className = v
    } else if (k === 'html') {
      node.innerHTML = v
    } else {
      node.setAttribute(k, v)
    }
  })
  children.flat().forEach(c => {
    if (c) node.append(typeof c === 'string' ? document.createTextNode(c) : c)
  })
  return node
}

// Icons as SVG strings
const icons = {
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  trendDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z"/><path d="M5 2L5.5 4L7.5 4.5L5.5 5L5 7L4.5 5L2.5 4.5L4.5 4L5 2Z"/></svg>`,
  bot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
}

// Modal functions
function showModal(title, content) {
  const existing = document.querySelector('.modal-overlay')
  if (existing) existing.remove()
  
  const modal = el('div', { class: 'modal-overlay', onclick: (e) => { if (e.target.classList.contains('modal-overlay')) closeModal() } },
    el('div', { class: 'modal' },
      el('div', { class: 'modal-header' },
        el('h2', {}, title),
        el('button', { class: 'modal-close', onclick: closeModal, html: icons.close })
      ),
      el('div', { class: 'modal-body' }, content)
    )
  )
  document.body.appendChild(modal)
}

function closeModal() {
  document.querySelector('.modal-overlay')?.remove()
}

function showFeatures() {
  showModal('Features', el('div', { class: 'modal-content' },
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.clipboard }),
      el('h3', {}, 'Assignment Tracking'),
      el('p', {}, 'Keep all your homework in one place. Add assignments with due dates and class names, and never miss a deadline again.')
    ),
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.chart }),
      el('h3', {}, 'Grade Monitoring'),
      el('p', {}, 'Track your grades across all classes. See your overall average, grade distribution, and performance trends.')
    ),
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.timer }),
      el('h3', {}, 'Study Timer'),
      el('p', {}, 'Use the built-in timer to stay focused during study sessions. Adjust the time and get notified when time is up.')
    ),
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.send }),
      el('h3', {}, 'Hand In & Celebrate'),
      el('p', {}, 'Mark assignments as complete with the Hand In button. Get instant feedback with grades and a confetti celebration!')
    ),
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.calendar }),
      el('h3', {}, 'Due Date Alerts'),
      el('p', {}, 'See at a glance which assignments are overdue, due today, or coming up soon with color-coded labels.')
    ),
    el('div', { class: 'feature-card' },
      el('span', { class: 'feature-icon', html: icons.star }),
      el('h3', {}, 'Class Performance'),
      el('p', {}, 'View detailed breakdowns of your performance in each class, including highest and lowest grades.')
    )
  ))
}

function showAbout() {
  showModal('About StudentStudy', el('div', { class: 'modal-content about-content' },
    el('div', { class: 'about-logo', html: icons.logo }),
    el('h3', {}, 'StudentStudy'),
    el('p', { class: 'version' }, 'Version 1.0'),
    el('p', {}, 'StudentStudy is a simple, distraction-free homework tracking app designed to help students stay organized and on top of their schoolwork.'),
    el('p', {}, 'Built with vanilla JavaScript and love for students everywhere. No accounts required—your data is stored locally in your browser.'),
    el('div', { class: 'about-section' },
      el('h4', {}, '🎯 Our Mission'),
      el('p', {}, 'To help students go from chaos to clarity by providing a simple tool to track assignments, monitor grades, and stay focused.')
    ),
    el('div', { class: 'about-section' },
      el('h4', {}, '🔒 Privacy'),
      el('p', {}, 'All your data stays on your device. We don\'t collect any personal information or send data to servers.')
    ),
    el('div', { class: 'about-section' },
      el('h4', {}, '💻 Tech'),
      el('p', {}, 'Built with HTML, CSS, and vanilla JavaScript. No frameworks, no tracking, just a clean and fast experience.')
    )
  ))
}

function showHelp() {
  showModal('Help & Tips', el('div', { class: 'modal-content help-content' },
    el('div', { class: 'help-section' },
      el('h3', {}, '🚀 Getting Started'),
      el('ol', {},
        el('li', {}, 'Click "Get started free" or "Log in" to enter your name and email'),
        el('li', {}, 'Click "Add Demo Data" to see example assignments and grades'),
        el('li', {}, 'Or start adding your own assignments right away!')
      )
    ),
    el('div', { class: 'help-section' },
      el('h3', {}, '📝 Adding Assignments'),
      el('p', {}, 'Use the form at the top of the assignments section:'),
      el('ul', {},
        el('li', {}, 'Enter the assignment title (required)'),
        el('li', {}, 'Add a class name to organize by subject'),
        el('li', {}, 'Set a due date to track deadlines')
      )
    ),
    el('div', { class: 'help-section' },
      el('h3', {}, '✅ Handing In Assignments'),
      el('p', {}, 'Click the "Hand In" button to mark an assignment as complete. You\'ll receive a grade based on whether it was on time or late, and get a confetti celebration!')
    ),
    el('div', { class: 'help-section' },
      el('h3', {}, '⏱️ Using the Timer'),
      el('ul', {},
        el('li', {}, 'Click the timer in the bottom-right corner to expand it'),
        el('li', {}, 'Use + and − to adjust the time'),
        el('li', {}, 'Press play to start, pause to stop'),
        el('li', {}, 'You\'ll hear a sound and see confetti when time is up!')
      )
    ),
    el('div', { class: 'help-section' },
      el('h3', {}, '📊 Understanding Grades'),
      el('ul', {},
        el('li', {}, 'A: 90-100% (Green)'),
        el('li', {}, 'B: 80-89% (Blue)'),
        el('li', {}, 'C: 70-79% (Yellow)'),
        el('li', {}, 'D: 60-69% (Orange)'),
        el('li', {}, 'F: Below 60% (Red)')
      )
    ),
    el('div', { class: 'help-section' },
      el('h3', {}, '💡 Tips'),
      el('ul', {},
        el('li', {}, 'Assignments are sorted by due date—overdue ones appear first'),
        el('li', {}, 'Color-coded badges help you spot urgent deadlines'),
        el('li', {}, 'Your data is saved automatically in your browser'),
        el('li', {}, 'Use "Sign out" to switch between different users')
      )
    )
  ))
}

// Simple Timer State
let timerState = {
  timeLeft: 5 * 60,
  initialTime: 5 * 60,
  isRunning: false,
  intervalId: null,
  expanded: false
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display')
  if (display) display.textContent = formatTime(timerState.timeLeft)
}

function timerTick() {
  if (timerState.timeLeft > 0) {
    timerState.timeLeft--
    updateTimerDisplay()
  } else {
    pauseTimer()
    playTimerSound()
    launchConfetti()
    showTimerReminder()
  }
}

function startTimer() {
  if (!timerState.isRunning && timerState.timeLeft > 0) {
    timerState.isRunning = true
    timerState.intervalId = setInterval(timerTick, 1000)
    document.getElementById('timer-play')?.classList.add('hidden')
    document.getElementById('timer-pause')?.classList.remove('hidden')
  }
}

function pauseTimer() {
  timerState.isRunning = false
  clearInterval(timerState.intervalId)
  timerState.intervalId = null
  document.getElementById('timer-play')?.classList.remove('hidden')
  document.getElementById('timer-pause')?.classList.add('hidden')
}

function resetTimer() {
  pauseTimer()
  timerState.timeLeft = timerState.initialTime
  updateTimerDisplay()
}

function adjustTime(delta) {
  if (!timerState.isRunning) {
    timerState.timeLeft = Math.max(60, timerState.timeLeft + delta)
    timerState.initialTime = timerState.timeLeft
    updateTimerDisplay()
  }
}

function toggleTimerExpand() {
  timerState.expanded = !timerState.expanded
  document.getElementById('timer-widget')?.classList.toggle('expanded', timerState.expanded)
}

function playTimerSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    // Play multiple beeps for better notification
    const playBeep = (freq, startTime, duration) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      gain.gain.value = 0.3
      osc.start(startTime)
      osc.stop(startTime + duration)
    }
    // Play 3 beeps
    playBeep(800, ctx.currentTime, 0.15)
    playBeep(900, ctx.currentTime + 0.2, 0.15)
    playBeep(1000, ctx.currentTime + 0.4, 0.2)
    setTimeout(() => ctx.close(), 800)
  } catch (e) {}
}

function showTimerReminder() {
  // Add flashing effect to timer widget
  const timerWidget = document.getElementById('timer-widget')
  if (timerWidget) timerWidget.classList.add('timer-done')

  // Create overlay
  const overlay = el('div', { class: 'timer-alert-overlay', onclick: dismissTimerReminder })
  
  // Create alert popup
  const alert = el('div', { class: 'timer-alert', id: 'timer-alert' },
    el('div', { class: 'timer-alert-icon' }, '⏰'),
    el('h2', {}, "Time's Up!"),
    el('p', {}, 'Your study timer has finished. Great work staying focused!'),
    el('button', { onclick: dismissTimerReminder }, 'Got it!')
  )

  document.body.appendChild(overlay)
  document.body.appendChild(alert)

  // Also try to use browser notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏰ Timer Reminder', {
      body: "Time's up! Your study timer has finished.",
      icon: '/favicon.svg'
    })
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission()
  }
}

function dismissTimerReminder() {
  const alert = document.getElementById('timer-alert')
  const overlay = document.querySelector('.timer-alert-overlay')
  const timerWidget = document.getElementById('timer-widget')
  
  if (alert) alert.remove()
  if (overlay) overlay.remove()
  if (timerWidget) timerWidget.classList.remove('timer-done')
}

function renderTimer() {
  return el('div', { id: 'timer-widget', class: 'timer-widget' },
    el('div', { class: 'timer-compact', onclick: toggleTimerExpand },
      el('span', { class: 'timer-icon', html: icons.timer }),
      el('span', { id: 'timer-display', class: 'timer-time' }, formatTime(timerState.timeLeft))
    ),
    el('div', { class: 'timer-expanded' },
      el('div', { class: 'timer-adjust' },
        el('button', { onclick: (e) => { e.stopPropagation(); adjustTime(-60) } }, '−'),
        el('button', { onclick: (e) => { e.stopPropagation(); adjustTime(60) } }, '+')
      ),
      el('div', { class: 'timer-btns' },
        el('button', { id: 'timer-play', onclick: (e) => { e.stopPropagation(); startTimer() }, html: icons.play }),
        el('button', { id: 'timer-pause', class: 'hidden', onclick: (e) => { e.stopPropagation(); pauseTimer() }, html: icons.pause }),
        el('button', { onclick: (e) => { e.stopPropagation(); resetTimer() }, html: icons.reset })
      )
    )
  )
}

// ============ AI ASSISTANT ============
let aiChatOpen = false
let aiMessages = [
  { type: 'ai', text: "Hi! 👋 I'm your AI study assistant. I can help with study tips, time management, and using this app. What do you need help with?" }
]

const aiResponses = {
  greetings: [
    "Hey there! 👋 I'm your study buddy. How can I help you today?",
    "Hello! Ready to help you stay organized and ace your studies!",
    "Hi! 📚 Whether it's assignments, study tips, or time management - I'm here for you!"
  ],
  studyTips: [
    "📚 **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break!",
    "🧠 **Active Recall**: Instead of re-reading notes, close your book and try to remember what you learned. Then check yourself!",
    "✍️ **Teach Someone**: Explain concepts out loud as if teaching a friend. If you can teach it, you truly understand it!",
    "🎯 **Spaced Repetition**: Review material at increasing intervals (1 day, 3 days, 1 week). This moves info to long-term memory!",
    "😴 **Sleep is Key**: Your brain consolidates memories during sleep. Get 7-9 hours before exams!"
  ],
  timeManagement: "⏰ **Time Management Tips:**\n\n1. **Prioritize** - Focus on urgent assignments first\n2. **Break it down** - Big projects → small tasks\n3. **Time block** - Schedule specific study times\n4. **Start with the hardest** when energy is high\n5. **Use the timer** in the bottom-right corner!",
  assignments: "📝 **Assignment Tips:**\n\n• Click **Add Assignment** to track your work\n• Set due dates to stay organized\n• Mark complete when done for confetti! 🎉\n• Start assignments early - even 10 minutes helps!",
  motivation: [
    "💪 Remember: Every expert was once a beginner. Small steps lead to big achievements. You've got this!",
    "🌟 Feeling unmotivated is normal! Try the 2-minute rule: commit to just 2 minutes of work. Starting is the hardest part!",
    "🎯 Think about WHY you're studying. Picture your future self thanking you for the work today!",
    "🏆 Progress, not perfection! Even 15 minutes of focused study is better than zero."
  ],
  grades: "📊 **About Grades:**\n\n• Track grades in the Grades section\n• Focus on understanding, not just memorizing\n• Talk to your teacher early if struggling\n• One bad grade doesn't define you!",
  appHelp: "🚀 **How to Use StudentStudy:**\n\n📋 **Assignments** - Add and track homework\n📊 **Grades** - Monitor your performance\n⏱️ **Timer** - Stay focused (bottom-right)\n🎉 **Hand In** - Complete assignments with confetti!\n💾 **Offline** - Works without internet!",
  exams: "📖 **Exam Preparation:**\n\n1. Start early - review a little each day\n2. Make study guides - condense to key points\n3. Practice problems - especially for math/science\n4. Use flashcards for definitions\n5. Get enough sleep the night before!\n6. Use the study timer! ⏱️",
  jokes: [
    "Why did the student eat their homework? Because their teacher said it was a piece of cake! 🍰😄",
    "What's a math teacher's favorite season? Sum-mer! ☀️😂",
    "Why was the math book sad? It had too many problems! 📚😅"
  ],
  thanks: "You're welcome! 😊 Happy to help anytime. Good luck with your studies! 📚✨",
  bye: "Good luck with your studies! 🍀 Remember, I'm here whenever you need help. See you later! 👋",
  default: "I can help with:\n• 📚 Study tips\n• ⏰ Time management\n• 📝 Assignment advice\n• 💪 Motivation\n• 🚀 How to use the app\n\nTry asking about any of these!"
}

function getAIResponse(message) {
  const lower = message.toLowerCase()
  
  if (lower.match(/^(hi|hello|hey|sup|what's up)/)) {
    return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)]
  }
  if (lower.match(/(study tip|how to study|study better|study advice)/)) {
    return aiResponses.studyTips[Math.floor(Math.random() * aiResponses.studyTips.length)]
  }
  if (lower.match(/(time management|manage time|too busy|overwhelmed|stressed|procrastinat)/)) {
    return aiResponses.timeManagement
  }
  if (lower.match(/(assignment|homework|due|deadline|project)/)) {
    return aiResponses.assignments
  }
  if (lower.match(/(motivat|don't want|lazy|tired|can't focus|distracted)/)) {
    return aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)]
  }
  if (lower.match(/(grade|mark|score|gpa|failing)/)) {
    return aiResponses.grades
  }
  if (lower.match(/(how to use|how does|app work|feature|help with app|tutorial)/)) {
    return aiResponses.appHelp
  }
  if (lower.match(/(exam|test|quiz|prepare|review)/)) {
    return aiResponses.exams
  }
  if (lower.match(/(joke|funny|make me laugh|bored)/)) {
    return aiResponses.jokes[Math.floor(Math.random() * aiResponses.jokes.length)]
  }
  if (lower.match(/(thank|thanks|thx)/)) {
    return aiResponses.thanks
  }
  if (lower.match(/(bye|goodbye|see you|later)/)) {
    return aiResponses.bye
  }
  
  return aiResponses.default
}

function toggleAIChat() {
  aiChatOpen = !aiChatOpen
  const widget = document.getElementById('ai-widget')
  const chatWindow = document.getElementById('ai-chat-window')
  
  if (widget) widget.classList.toggle('hidden', aiChatOpen)
  if (chatWindow) chatWindow.classList.toggle('hidden', !aiChatOpen)
}

function sendAIMessage() {
  const input = document.getElementById('ai-input')
  const message = input?.value?.trim()
  if (!message) return
  
  // Add user message
  aiMessages.push({ type: 'user', text: message })
  input.value = ''
  
  // Render messages
  renderAIMessages()
  
  // Get AI response after short delay
  setTimeout(() => {
    aiMessages.push({ type: 'ai', text: getAIResponse(message) })
    renderAIMessages()
  }, 500 + Math.random() * 500)
}

function renderAIMessages() {
  const container = document.getElementById('ai-messages')
  if (!container) return
  
  container.innerHTML = ''
  aiMessages.forEach(msg => {
    const msgEl = el('div', { class: `ai-message ai-message-${msg.type}` },
      el('div', { class: `ai-avatar ai-avatar-${msg.type}`, html: msg.type === 'ai' ? icons.bot : icons.user }),
      el('div', { class: 'ai-bubble' }, msg.text)
    )
    container.appendChild(msgEl)
  })
  container.scrollTop = container.scrollHeight
}

function handleAIKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    sendAIMessage()
  }
}

function sendQuickAI(message) {
  const input = document.getElementById('ai-input')
  if (input) input.value = message
  sendAIMessage()
}

function renderAIAssistant() {
  return el('div', { id: 'ai-container' },
    // Floating button
    el('button', { id: 'ai-widget', class: 'ai-widget', onclick: toggleAIChat },
      el('span', { class: 'ai-widget-icon', html: icons.sparkles }),
      el('span', { class: 'ai-widget-text' }, 'Ask AI')
    ),
    // Chat window
    el('div', { id: 'ai-chat-window', class: 'ai-chat-window hidden' },
      // Header
      el('div', { class: 'ai-chat-header' },
        el('div', { class: 'ai-chat-title' },
          el('span', { class: 'ai-header-icon', html: icons.bot }),
          el('div', {},
            el('strong', {}, 'Study Assistant'),
            el('small', {}, 'Always here to help!')
          )
        ),
        el('button', { class: 'ai-close-btn', onclick: toggleAIChat, html: icons.close })
      ),
      // Messages
      el('div', { id: 'ai-messages', class: 'ai-messages' }),
      // Quick suggestions
      el('div', { class: 'ai-quick' },
        el('button', { onclick: () => sendQuickAI('Give me study tips') }, '📚 Study tips'),
        el('button', { onclick: () => sendQuickAI('Help with time management') }, '⏰ Time'),
        el('button', { onclick: () => sendQuickAI('How do I use this app?') }, '🚀 App help')
      ),
      // Input
      el('div', { class: 'ai-input-area' },
        el('input', { type: 'text', id: 'ai-input', placeholder: 'Ask me anything...', onkeypress: handleAIKeyPress }),
        el('button', { class: 'ai-send-btn', onclick: sendAIMessage, html: icons.send })
      )
    )
  )
}
// ============ END AI ASSISTANT ============

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return 'No due date'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  
  if (diff < 0) return { text: `${Math.abs(diff)} days overdue`, class: 'overdue' }
  if (diff === 0) return { text: 'Due today', class: 'due-soon' }
  if (diff === 1) return { text: 'Due tomorrow', class: 'due-soon' }
  if (diff <= 7) return { text: `Due in ${diff} days`, class: 'due-soon' }
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), class: '' }
}

// Render navbar
function renderNavbar(user) {
  return el('nav', { class: 'navbar' },
    el('div', { class: 'nav-logo', html: icons.logo }, ' StudentStudy'),
    el('div', { class: 'nav-links' },
      el('a', { href: '#', class: 'nav-link', onclick: (e) => { e.preventDefault(); showFeatures() } }, 'Features'),
      el('a', { href: '#', class: 'nav-link', onclick: (e) => { e.preventDefault(); showAbout() } }, 'About'),
      el('a', { href: '#', class: 'nav-link', onclick: (e) => { e.preventDefault(); showHelp() } }, 'Help')
    ),
    el('div', { class: 'nav-actions' },
      user
        ? el('button', { class: 'btn btn-ghost', onclick: () => { clearCurrentUser(); render() } }, 'Log out')
        : el('button', { class: 'btn btn-ghost', onclick: () => showLogin() }, 'Log in'),
      !user && el('button', { class: 'btn btn-primary', onclick: () => showLogin() }, 'Get started free')
    )
  )
}

// Render hero/landing page
function renderHero() {
  return el('section', { class: 'hero' },
    el('div', { class: 'hero-content' },
      el('h1', {}, 'From chaos to clarity'),
      el('div', { class: 'hero-features' },
        el('div', { class: 'feature-item' },
          el('div', { class: 'feature-dot' }),
          el('div', {},
            el('div', { class: 'feature-title' }, 'Track assignments')
          )
        ),
        el('div', { class: 'feature-item active' },
          el('div', { class: 'feature-dot' }),
          el('div', {},
            el('div', { class: 'feature-title' }, 'Never miss deadlines'),
            el('div', { class: 'feature-desc' }, 'Get reminders for upcoming homework. See everything in one organized view.')
          )
        ),
        el('div', { class: 'feature-item' },
          el('div', { class: 'feature-dot' }),
          el('div', {},
            el('div', { class: 'feature-title' }, 'Monitor your grades')
          )
        ),
        el('div', { class: 'feature-item' },
          el('div', { class: 'feature-dot' }),
          el('div', {},
            el('div', { class: 'feature-title' }, 'Organize by class')
          )
        ),
        el('div', { class: 'feature-item' },
          el('div', { class: 'feature-dot' }),
          el('div', {},
            el('div', { class: 'feature-title' }, 'Stay on top of school')
          )
        )
      )
    ),
    el('div', { class: 'hero-visual' },
      el('div', { class: 'visual-container' },
        el('div', { class: 'sync-badge' },
          el('div', { class: 'sync-dot' }),
          'SYNCING ...'
        ),
        el('div', { class: 'main-card', html: icons.logo }),
        el('div', { class: 'floating-cards' },
          el('div', { class: 'float-card assignments' },
            el('div', { class: 'card-label' }, 'Assignments'),
            el('div', { class: 'card-value' }, 'Math HW #5'),
            el('div', { class: 'card-value' }, 'Essay Draft'),
            el('div', { class: 'card-value' }, 'Lab Report')
          ),
          el('div', { class: 'float-card grades' },
            el('div', {},
              el('div', { class: 'card-label' }, 'Latest Grade'),
              el('div', { class: 'card-value' }, '94% - History Quiz')
            ),
            el('div', { class: 'star-rating' }, '★★★★★')
          ),
          el('div', { class: 'float-card classes' },
            el('div', { class: 'card-label' }, 'Classes'),
            el('div', { class: 'card-value' }, '5 active courses')
          )
        )
      )
    )
  )
}

// Render login form
function showLogin() {
  root.innerHTML = ''
  root.append(
    renderNavbar(null),
    el('div', { class: 'login-container' },
      el('div', { class: 'login-card' },
        el('h2', { class: 'login-title' }, 'Welcome back'),
        el('p', { class: 'login-subtitle' }, 'Sign in to continue or create a new account'),
        el('form', { class: 'login-form', onsubmit: handleLogin },
          el('input', { type: 'email', class: 'form-input', placeholder: 'Email address', id: 'login-email', required: '' }),
          el('input', { type: 'text', class: 'form-input', placeholder: 'Your name (for new accounts)', id: 'login-name' }),
          el('button', { type: 'submit', class: 'btn btn-primary login-btn' }, 'Continue'),
          el('button', { type: 'button', class: 'btn btn-ghost login-btn', onclick: () => render() }, 'Cancel')
        )
      )
    )
  )
}

function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById('login-email').value.trim()
  const name = document.getElementById('login-name').value.trim() || 'Student'
  
  if (!email) return
  
  const existing = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
  let userObj = existing
  
  if (!existing) {
    userObj = createUser({ email, name })
    seedDemoData(userObj.id, 'student')
  }
  
  setCurrentUser(userObj)
  render()
}

// Render dashboard (logged in view)
function renderDashboard(user) {
  const assignments = getAssignmentsByUser(user.id)
  const grades = getGradesByUser(user.id)
  const initials = (user.name || user.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  // Group grades by class and calculate stats
  const classStats = {}
  grades.forEach(g => {
    const className = g.className || 'Uncategorized'
    if (!classStats[className]) {
      classStats[className] = { grades: [], total: 0, count: 0 }
    }
    classStats[className].grades.push(g)
    classStats[className].total += g.grade
    classStats[className].count++
  })
  
  // Calculate averages and trends
  Object.keys(classStats).forEach(className => {
    const stats = classStats[className]
    stats.average = Math.round(stats.total / stats.count)
    stats.grades.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived))
    // Trend: compare latest grade to average
    if (stats.grades.length >= 2) {
      const latest = stats.grades[0].grade
      const previous = stats.grades[1].grade
      stats.trend = latest >= previous ? 'up' : 'down'
      stats.trendDiff = latest - previous
    }
  })
  
  // Overall average
  const overallAvg = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length) 
    : null

  // Get letter grade
  function getLetterGrade(avg) {
    if (avg >= 90) return { letter: 'A', color: '#22c55e' }
    if (avg >= 80) return { letter: 'B', color: '#3b82f6' }
    if (avg >= 70) return { letter: 'C', color: '#f59e0b' }
    if (avg >= 60) return { letter: 'D', color: '#f97316' }
    return { letter: 'F', color: '#ef4444' }
  }
  
  return el('div', { class: 'app-container' },
    el('header', { class: 'app-header' },
      el('div', { class: 'user-info' },
        el('div', { class: 'user-avatar' }, initials),
        el('div', {},
          el('div', { class: 'user-name' }, user.name || 'Student'),
          el('div', { class: 'user-email' }, user.email)
        )
      ),
      el('div', { style: 'display: flex; gap: 0.5rem;' },
        el('button', { class: 'btn btn-outline', onclick: () => { seedDemoData(user.id, 'student'); render() } }, 'Add Demo Data'),
        el('button', { class: 'btn btn-ghost', onclick: () => { clearCurrentUser(); render() } }, 'Sign out')
      )
    ),

    // Quick Stats Bar
    el('div', { class: 'stats-bar' },
      el('div', { class: 'stat-box' },
        el('div', { class: 'stat-number' }, assignments.length),
        el('div', { class: 'stat-label-sm' }, 'Total Assignments')
      ),
      el('div', { class: 'stat-box' },
        el('div', { class: 'stat-number overdue' }, assignments.filter(a => {
          if (!a.dueDate) return false
          return new Date(a.dueDate) < new Date()
        }).length),
        el('div', { class: 'stat-label-sm' }, 'Overdue')
      ),
      el('div', { class: 'stat-box' },
        el('div', { class: 'stat-number due-soon' }, assignments.filter(a => {
          if (!a.dueDate) return false
          const diff = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
          return diff >= 0 && diff <= 3
        }).length),
        el('div', { class: 'stat-label-sm' }, 'Due Soon')
      ),
      el('div', { class: 'stat-box' },
        el('div', { class: 'stat-number', style: overallAvg ? `color: ${getLetterGrade(overallAvg).color}` : '' }, 
          overallAvg ? `${overallAvg}%` : '—'
        ),
        el('div', { class: 'stat-label-sm' }, 'Average Grade')
      )
    ),
    
    // Assignments Section
    el('section', { class: 'assignments-section' },
      el('div', { class: 'section-header' },
        el('h2', { class: 'section-title' },
          el('span', { html: icons.clipboard }),
          'Your Assignments'
        ),
        el('div', { class: 'section-subtitle' }, 
          assignments.length > 0 
            ? `${assignments.length} assignment${assignments.length !== 1 ? 's' : ''} to track`
            : 'No assignments yet'
        )
      ),
      
      // Add form at top for quick access
      el('div', { class: 'add-form-inline' },
        el('input', { type: 'text', class: 'form-input', placeholder: 'Add new assignment...', id: 'new-title' }),
        el('input', { type: 'text', class: 'form-input', placeholder: 'Class (optional)', id: 'new-class', style: 'max-width: 150px;' }),
        el('input', { type: 'date', class: 'form-input', id: 'new-due', style: 'max-width: 150px;' }),
        el('button', { class: 'btn btn-success', onclick: addAssignment, html: icons.plus + ' Add' })
      ),
      
      assignments.length > 0
        ? el('div', { class: 'assignments-list' },
            ...assignments
              .sort((a, b) => {
                // Sort: overdue first, then by due date
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return new Date(a.dueDate) - new Date(b.dueDate)
              })
              .map(a => {
                const due = formatDate(a.dueDate)
                const isOverdue = due.class === 'overdue'
                const isDueSoon = due.class === 'due-soon'
                return el('div', { class: `assignment-row ${isOverdue ? 'overdue-row' : ''} ${isDueSoon ? 'due-soon-row' : ''}` },
                  el('div', { class: 'assignment-main' },
                    el('div', { class: 'assignment-title-row' },
                      el('span', { class: 'assignment-title' }, a.title),
                      a.className && el('span', { class: 'assignment-class-badge' }, a.className)
                    ),
                    a.description && el('div', { class: 'assignment-desc' }, a.description)
                  ),
                  el('div', { class: 'assignment-right' },
                    el('div', { class: `assignment-due ${due.class}` },
                      el('span', { html: icons.calendar }),
                      due.text
                    ),
                    el('button', { 
                      class: 'btn-handin', 
                      html: icons.send + ' Hand In',
                      title: 'Hand in assignment',
                      onclick: () => handInAssignment(a)
                    }),
                    el('button', { 
                      class: 'btn-delete', 
                      html: icons.trash,
                      title: 'Delete assignment',
                      onclick: () => { deleteAssignment(a.id); render() }
                    })
                  )
                )
              })
          )
        : el('div', { class: 'empty-state-small' },
            el('p', {}, 'Add your first assignment above or click "Add Demo Data" to see examples')
          )
    ),
    
    // Class Performance Section (NOW BELOW)
    el('section', { class: 'performance-section' },
      el('div', { class: 'section-header' },
        el('h2', { class: 'section-title' },
          el('span', { html: icons.chart }),
          'Class Performance'
        ),
        el('div', { class: 'section-subtitle' }, 
          grades.length > 0 
            ? `${grades.length} grade${grades.length !== 1 ? 's' : ''} recorded across ${Object.keys(classStats).length} class${Object.keys(classStats).length !== 1 ? 'es' : ''}`
            : 'No grades recorded yet'
        )
      ),
      
      overallAvg !== null
        ? el('div', { class: 'performance-content' },
            // Overall grade prominently displayed
            el('div', { class: 'overall-card' },
              el('div', { class: 'overall-main' },
                el('div', { class: 'overall-grade-big', style: `color: ${getLetterGrade(overallAvg).color}` },
                  getLetterGrade(overallAvg).letter
                ),
                el('div', { class: 'overall-details' },
                  el('div', { class: 'overall-percent' }, `${overallAvg}% Overall`),
                  el('div', { class: 'overall-info' }, `Across ${grades.length} graded assignments`)
                )
              ),
              el('div', { class: 'grade-breakdown' },
                el('div', { class: 'breakdown-title' }, 'Grade Breakdown'),
                el('div', { class: 'breakdown-bars' },
                  ...['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'].map((label, i) => {
                    const ranges = [[90,100], [80,89], [70,79], [60,69], [0,59]]
                    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444']
                    const count = grades.filter(g => g.grade >= ranges[i][0] && g.grade <= ranges[i][1]).length
                    const percent = grades.length > 0 ? Math.round((count / grades.length) * 100) : 0
                    return el('div', { class: 'breakdown-row' },
                      el('span', { class: 'breakdown-label' }, label),
                      el('div', { class: 'breakdown-bar-bg' },
                        el('div', { class: 'breakdown-bar-fill', style: `width: ${percent}%; background: ${colors[i]}` })
                      ),
                      el('span', { class: 'breakdown-count' }, count)
                    )
                  })
                )
              )
            ),
            
            // Per-class cards
            el('div', { class: 'classes-grid' },
              ...Object.entries(classStats).map(([className, stats]) => {
                const letterGrade = getLetterGrade(stats.average)
                const highGrade = Math.max(...stats.grades.map(g => g.grade))
                const lowGrade = Math.min(...stats.grades.map(g => g.grade))
                return el('div', { class: 'class-card' },
                  el('div', { class: 'class-header' },
                    el('div', { class: 'class-name' }, className),
                    el('div', { class: 'class-grade', style: `background: ${letterGrade.color}20; color: ${letterGrade.color}` }, 
                      `${letterGrade.letter} (${stats.average}%)`
                    )
                  ),
                  el('div', { class: 'class-stats-row' },
                    el('div', { class: 'mini-stat' },
                      el('span', { class: 'mini-stat-value' }, stats.count),
                      el('span', { class: 'mini-stat-label' }, 'Graded')
                    ),
                    el('div', { class: 'mini-stat' },
                      el('span', { class: 'mini-stat-value', style: 'color: #22c55e' }, `${highGrade}%`),
                      el('span', { class: 'mini-stat-label' }, 'Highest')
                    ),
                    el('div', { class: 'mini-stat' },
                      el('span', { class: 'mini-stat-value', style: 'color: #ef4444' }, `${lowGrade}%`),
                      el('span', { class: 'mini-stat-label' }, 'Lowest')
                    ),
                    stats.trend && el('div', { class: 'mini-stat' },
                      el('span', { class: `mini-stat-value trend-${stats.trend}` }, 
                        `${stats.trendDiff > 0 ? '+' : ''}${stats.trendDiff}%`
                      ),
                      el('span', { class: 'mini-stat-label' }, 'Trend')
                    )
                  ),
                  el('div', { class: 'recent-grades' },
                    el('div', { class: 'recent-header' },
                      el('span', {}, 'Recent Grades'),
                      el('span', { class: 'see-all' }, `${stats.grades.length} total`)
                    ),
                    el('div', { class: 'grades-list' },
                      ...stats.grades.slice(0, 4).map(g => 
                        el('div', { class: 'grade-item' },
                          el('span', { class: 'grade-name' }, g.assignmentName),
                          el('span', { class: 'grade-score', style: `color: ${getLetterGrade(g.grade).color}` }, `${g.grade}%`)
                        )
                      )
                    )
                  )
                )
              })
            )
          )
        : el('div', { class: 'empty-state-small' },
            el('p', {}, 'Click "Add Demo Data" to see sample grades and class performance')
          )
    )
  )
}

function addAssignment() {
  const user = getCurrentUser()
  const title = document.getElementById('new-title').value.trim()
  const className = document.getElementById('new-class').value.trim() || null
  const dueDate = document.getElementById('new-due').value || null
  
  if (!title) {
    alert('Please enter a title')
    return
  }
  
  createAssignment({ studentId: user.id, classId: null, className, title, dueDate })
  document.getElementById('new-title').value = ''
  document.getElementById('new-class').value = ''
  document.getElementById('new-due').value = ''
  render()
}

// Confetti animation
function launchConfetti() {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']
  const confettiCount = 150
  const container = document.createElement('div')
  container.className = 'confetti-container'
  document.body.appendChild(container)
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = Math.random() * 100 + 'vw'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = Math.random() * 0.5 + 's'
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
    
    // Random shapes
    const shape = Math.random()
    if (shape > 0.6) {
      confetti.style.borderRadius = '50%'
    } else if (shape > 0.3) {
      confetti.style.borderRadius = '2px'
    }
    
    // Random rotation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`
    
    container.appendChild(confetti)
  }
  
  // Remove confetti after animation
  setTimeout(() => {
    container.remove()
  }, 4000)
}

// Hand in assignment - creates a grade and removes the assignment
function handInAssignment(assignment) {
  const user = getCurrentUser()
  
  // Launch confetti first!
  launchConfetti()
  
  // Generate a realistic grade (weighted towards better grades for on-time submissions)
  const now = new Date()
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : now
  const isLate = now > dueDate
  
  let grade
  if (isLate) {
    // Late submissions get lower grades (50-85)
    grade = Math.floor(Math.random() * 36) + 50
  } else {
    // On-time submissions get better grades (70-100, weighted towards higher)
    const rand = Math.random()
    if (rand > 0.7) {
      grade = Math.floor(Math.random() * 11) + 90 // 90-100 (30% chance)
    } else if (rand > 0.3) {
      grade = Math.floor(Math.random() * 10) + 80 // 80-89 (40% chance)
    } else {
      grade = Math.floor(Math.random() * 10) + 70 // 70-79 (30% chance)
    }
  }
  
  // Create the grade
  createGrade({
    studentId: user.id,
    assignmentName: assignment.title,
    className: assignment.className || 'General',
    grade: grade,
    dateReceived: new Date().toISOString()
  })
  
  // Delete the assignment
  deleteAssignment(assignment.id)
  
  // Show feedback after a short delay so confetti is visible
  setTimeout(() => {
    const gradeMsg = grade >= 90 ? '🎉 Excellent work!' : 
                     grade >= 80 ? '👍 Good job!' : 
                     grade >= 70 ? '👌 Nice effort!' : 
                     isLate ? '⚠️ Handed in late' : '📝 Keep it up!'
    
    alert(`Assignment handed in!\n\nGrade: ${grade}%\n${gradeMsg}`)
    
    render()
  }, 500)
}

// Main render function
function render() {
  root.innerHTML = ''
  const user = getCurrentUser()
  
  root.append(renderNavbar(user))
  
  if (user) {
    root.append(renderDashboard(user))
    root.append(renderTimer())
    root.append(renderAIAssistant())
    // Initialize AI messages display
    setTimeout(renderAIMessages, 100)
  } else {
    root.append(renderHero())
  }
}

// Initial render
render()

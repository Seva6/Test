import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Calendar, Brain, Clock } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

// AI responses based on keywords and context
const getAIResponse = (message, context = {}) => {
  const lowerMessage = message.toLowerCase()
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|sup|what's up|howdy)/)) {
    const greetings = [
      "Hey there! 👋 I'm your study buddy. How can I help you today?",
      "Hello! Ready to help you stay organized and ace your studies! What do you need?",
      "Hi! 📚 Whether it's assignments, study tips, or time management - I'm here for you!"
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Study tips
  if (lowerMessage.match(/(study tip|how to study|study better|study advice|help me study)/)) {
    const tips = [
      "📚 **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This keeps your brain fresh!",
      "🧠 **Active Recall**: Instead of re-reading notes, close your book and try to remember what you learned. Then check yourself. This strengthens memory!",
      "✍️ **Teach Someone**: Explain concepts out loud as if teaching a friend. If you can teach it, you truly understand it!",
      "🎯 **Spaced Repetition**: Review material at increasing intervals (1 day, 3 days, 1 week, 2 weeks). This moves info to long-term memory!",
      "😴 **Sleep is Key**: Your brain consolidates memories during sleep. Get 7-9 hours before exams - all-nighters actually hurt performance!"
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  // Time management
  if (lowerMessage.match(/(time management|manage time|too busy|overwhelmed|stressed|no time|procrastinat)/)) {
    return "⏰ **Time Management Tips:**\n\n1. **Prioritize**: Use the app to mark urgent assignments\n2. **Break it down**: Big projects → small milestones\n3. **Time block**: Schedule specific study times\n4. **Start with the hardest task** when your energy is highest\n5. **Say no** to distractions during study time\n\nWant me to help you break down a specific assignment?"
  }

  // Assignment help
  if (lowerMessage.match(/(assignment|homework|due|deadline|project)/)) {
    return "📝 **Assignment Tips:**\n\n• Use the **+ Add Assignment** button to track your work\n• Set **milestones** for big projects to avoid last-minute stress\n• Check your **Calendar** to visualize all deadlines\n• Start assignments the day you get them - even just 10 minutes helps!\n\nNeed help adding an assignment or breaking down a project?"
  }

  // Motivation
  if (lowerMessage.match(/(motivat|don't want|lazy|tired|can't focus|distracted|bored)/)) {
    const motivation = [
      "💪 Remember: Every expert was once a beginner. Small steps lead to big achievements. You've got this!",
      "🌟 Feeling unmotivated is normal! Try the 2-minute rule: commit to just 2 minutes of work. Often, starting is the hardest part!",
      "🎯 Think about WHY you're studying. Picture your future self thanking you for putting in the work today!",
      "🏆 Progress, not perfection! Even 15 minutes of focused study is better than zero. Start small!"
    ]
    return motivation[Math.floor(Math.random() * motivation.length)]
  }

  // Grades
  if (lowerMessage.match(/(grade|mark|score|gpa|failing|pass)/)) {
    return "📊 **About Grades:**\n\n• Track grades in the **Grades** section to see your average\n• Focus on understanding, not just memorizing\n• Talk to your teacher early if you're struggling\n• One bad grade doesn't define you - it's a chance to learn!\n\nWant tips on improving in a specific subject?"
  }

  // App help
  if (lowerMessage.match(/(how to use|how does|app work|feature|help with app|tutorial)/)) {
    return "🚀 **App Features:**\n\n📋 **Dashboard**: See all your stats at a glance\n📝 **Assignments**: Add and track homework\n📅 **Calendar**: Visual view of all deadlines\n📊 **Grades**: Track your academic performance\n🔔 **Notifications**: Get deadline reminders\n⚙️ **Settings**: Customize dark mode & more\n\n**Pro tip**: The app works offline too! Your data saves locally."
  }

  // Exam/test help
  if (lowerMessage.match(/(exam|test|quiz|prepare|review)/)) {
    return "📖 **Exam Preparation:**\n\n1. **Start early** - review a little each day\n2. **Make a study guide** - condense notes to key points\n3. **Practice problems** - especially for math/science\n4. **Flashcards** - great for definitions and facts\n5. **Get enough sleep** the night before!\n6. **Eat well** and stay hydrated\n\nYou can add your exam to the app to get reminders! 📝"
  }

  // Subject-specific
  if (lowerMessage.match(/(math|calculus|algebra|geometry)/)) {
    return "🔢 **Math Tips:**\n\n• Practice problems daily - math is a skill!\n• Understand the 'why' not just the 'how'\n• Watch YouTube tutorials (Khan Academy is great)\n• Form study groups to solve problems together\n• Don't skip steps - show your work\n\nWhat specific topic are you working on?"
  }

  if (lowerMessage.match(/(english|essay|writing|reading|book)/)) {
    return "📚 **English/Writing Tips:**\n\n• **Essays**: Start with an outline before writing\n• **Reading**: Take notes and highlight key passages\n• **Vocabulary**: Read widely to naturally expand words\n• **Grammar**: Read your work aloud to catch errors\n• **Thesis**: Make sure every paragraph supports your main point\n\nNeed help with a specific assignment?"
  }

  if (lowerMessage.match(/(science|biology|chemistry|physics)/)) {
    return "🔬 **Science Tips:**\n\n• **Understand concepts** - don't just memorize\n• **Draw diagrams** - visualize processes\n• **Lab work**: Connect theory to experiments\n• **Formulas**: Understand what each variable means\n• **Practice problems**: Apply concepts actively\n\nWhich science subject do you need help with?"
  }

  // Thank you
  if (lowerMessage.match(/(thank|thanks|thx|appreciate)/)) {
    return "You're welcome! 😊 Happy to help anytime. Good luck with your studies! 📚✨"
  }

  // Goodbye
  if (lowerMessage.match(/(bye|goodbye|see you|later|gotta go)/)) {
    return "Good luck with your studies! 🍀 Remember, I'm here whenever you need help. See you later! 👋"
  }

  // Jokes
  if (lowerMessage.match(/(joke|funny|make me laugh|bored)/)) {
    const jokes = [
      "Why did the student eat their homework? Because their teacher said it was a piece of cake! 🍰😄",
      "What's a math teacher's favorite season? Sum-mer! ☀️😂",
      "Why was the math book sad? It had too many problems! 📚😅",
      "What do you call a dinosaur that crashes their car? Tyrannosaurus Wrecks! 🦖😄"
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  // Default responses
  const defaults = [
    "I'm here to help with studying, assignments, time management, and more! Try asking for study tips or help with a specific subject. 📚",
    "Hmm, I'm not sure about that. But I can help with:\n• 📝 Assignment tips\n• 📚 Study strategies\n• ⏰ Time management\n• 🎯 Motivation\n\nWhat would you like to know?",
    "Interesting question! I'm best at helping with school stuff. Try asking about study tips, how to use the app, or advice on a specific subject!"
  ]
  return defaults[Math.floor(Math.random() * defaults.length)]
}

// Quick suggestion buttons
const quickSuggestions = [
  { icon: Brain, text: "Study tips", message: "Give me some study tips" },
  { icon: Clock, text: "Time management", message: "How do I manage my time better?" },
  { icon: BookOpen, text: "How to use app", message: "How do I use this app?" },
  { icon: Calendar, text: "Exam prep", message: "How should I prepare for exams?" }
]

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! 👋 I'm your AI study assistant. I can help with study tips, time management, and using this app. What do you need help with?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { christmasMode } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = (messageText = inputValue) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: getAIResponse(messageText),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 500 + Math.random() * 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button - Moved to LEFT side to avoid timer conflict */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-24 left-4 lg:bottom-6 lg:left-auto lg:right-24 z-[9999]
          px-4 py-3 rounded-full shadow-lg
          flex items-center gap-2
          transition-all duration-300 hover:scale-110
          ${christmasMode 
            ? 'bg-gradient-to-r from-red-500 to-green-500' 
            : 'bg-gradient-to-r from-purple-600 to-blue-500'
          }
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        style={{ boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5)' }}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-white font-medium text-sm">Ask AI</span>
      </button>

      {/* Chat Window */}
      <div
        className={`
          fixed bottom-24 left-4 lg:bottom-6 lg:left-auto lg:right-24 z-[9999]
          w-[calc(100%-2rem)] sm:w-96 h-[500px] max-h-[70vh]
          bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
          transition-all duration-300 origin-bottom-left lg:origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          ${christmasMode ? 'border-2 border-red-500' : 'border border-gray-200 dark:border-gray-700'}
        `}
      >
        {/* Header */}
        <div className={`
          px-4 py-3 flex items-center justify-between
          ${christmasMode 
            ? 'bg-gradient-to-r from-red-500 to-green-500' 
            : 'bg-gradient-to-r from-primary-500 to-secondary-500'
          }
        `}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {christmasMode ? '🎅 Holiday Helper' : 'Study Assistant'}
              </h3>
              <p className="text-xs text-white/80">Always here to help!</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.type === 'ai' 
                  ? christmasMode 
                    ? 'bg-gradient-to-r from-red-500 to-green-500' 
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                  : 'bg-gray-300 dark:bg-gray-600'
                }
              `}>
                {message.type === 'ai' 
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-white" />
                }
              </div>
              <div className={`
                max-w-[75%] p-3 rounded-2xl whitespace-pre-wrap
                ${message.type === 'user'
                  ? christmasMode
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-sm'
                    : 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                }
              `}>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${christmasMode 
                  ? 'bg-gradient-to-r from-red-500 to-green-500' 
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                }
              `}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggestion.message)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-colors
                    ${christmasMode
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200'
                      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200'
                    }
                  `}
                >
                  <suggestion.icon className="w-3 h-3" />
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${christmasMode
                  ? 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600'
                  : 'bg-primary-500 hover:bg-primary-600'
                }
              `}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AIAssistant

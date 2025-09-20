// Global state
let currentUser = null
let currentGoal = null
let currentWeek = 1
let aiAssistantOpen = false

// Sample data
const learningGoals = {
  cybersecurity: {
    name: "Cybersecurity",
    weeks: [
      {
        title: "Security Fundamentals",
        days: [
          { name: "Monday", tasks: "Introduction to Cybersecurity" },
          { name: "Tuesday", tasks: "Network Security Basics" },
          { name: "Wednesday", tasks: "Cryptography Fundamentals" },
          { name: "Thursday", tasks: "Risk Assessment" },
          { name: "Friday", tasks: "Security Policies" },
          { name: "Saturday", tasks: "Practice Lab" },
          { name: "Sunday", tasks: "Review & Quiz" },
        ],
      },
    ],
  },
  programming: {
    name: "Programming",
    weeks: [
      {
        title: "Programming Fundamentals",
        days: [
          { name: "Monday", tasks: "Variables & Data Types" },
          { name: "Tuesday", tasks: "Control Structures" },
          { name: "Wednesday", tasks: "Functions & Methods" },
          { name: "Thursday", tasks: "Arrays & Lists" },
          { name: "Friday", tasks: "Object-Oriented Concepts" },
          { name: "Saturday", tasks: "Practice Projects" },
          { name: "Sunday", tasks: "Code Review & Quiz" },
        ],
      },
    ],
  },
  "data-science": {
    name: "Data Science",
    weeks: [
      {
        title: "Data Science Basics",
        days: [
          { name: "Monday", tasks: "Introduction to Data Science" },
          { name: "Tuesday", tasks: "Statistics Fundamentals" },
          { name: "Wednesday", tasks: "Python for Data Science" },
          { name: "Thursday", tasks: "Data Visualization" },
          { name: "Friday", tasks: "Machine Learning Basics" },
          { name: "Saturday", tasks: "Hands-on Project" },
          { name: "Sunday", tasks: "Analysis & Presentation" },
        ],
      },
    ],
  },
}

const todayTasks = [
  {
    id: 1,
    title: "Watch: Introduction to Variables",
    description: "NPTEL lecture on programming fundamentals",
    duration: "45 min",
    completed: false,
  },
  {
    id: 2,
    title: "Read: Data Types in Python",
    description: "Reference document on Python data types",
    duration: "30 min",
    completed: true,
  },
  {
    id: 3,
    title: "Practice: Basic Exercises",
    description: "Complete 5 coding exercises",
    duration: "60 min",
    completed: false,
  },
  {
    id: 4,
    title: "Quiz: Variables & Data Types",
    description: "Test your understanding",
    duration: "15 min",
    completed: false,
  },
]

// Page navigation functions
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.getElementById(pageId).classList.add("active")
}

function showLogin() {
  showPage("login-page")
}

function showRegister() {
  showPage("register-page")
}

function showGoalSelection() {
  showPage("goal-selection-page")
}

function showDashboard() {
  showPage("dashboard-page")
  loadDashboardData()
}

// Authentication functions
function handleRegister(event) {
  event.preventDefault()

  const formData = {
    name: document.getElementById("reg-name").value,
    email: document.getElementById("reg-email").value,
    password: document.getElementById("reg-password").value,
    age: document.getElementById("reg-age").value,
    qualifications: document.getElementById("reg-qualifications").value,
    address: document.getElementById("reg-address").value,
  }

  // Simulate user registration
  currentUser = formData
  localStorage.setItem("learnloop_user", JSON.stringify(currentUser))

  showGoalSelection()
}

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value

  // Simulate login (in real app, this would validate against backend)
  const savedUser = localStorage.getItem("learnloop_user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    currentGoal = localStorage.getItem("learnloop_goal")
    showDashboard()
  } else {
    alert("Please register first or check your credentials")
  }
}

function logout() {
  currentUser = null
  currentGoal = null
  localStorage.removeItem("learnloop_user")
  localStorage.removeItem("learnloop_goal")
  showPage("landing-page")
}

// Goal selection
function selectGoal(goalId) {
  currentGoal = goalId
  localStorage.setItem("learnloop_goal", goalId)
  showDashboard()
}

// Dashboard functions
function showDashboardSection(sectionId) {
  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  event.target.closest(".nav-item").classList.add("active")

  // Show section
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(sectionId + "-section").classList.add("active")
}

function loadDashboardData() {
  if (currentUser) {
    document.getElementById("user-name").textContent = currentUser.name
    document.getElementById("welcome-name").textContent = currentUser.name.split(" ")[0]
  }

  if (currentGoal && learningGoals[currentGoal]) {
    document.getElementById("current-goal").textContent = learningGoals[currentGoal].name
  }

  loadTodayTasks()
  loadSchedule()
}

function loadTodayTasks() {
  const taskList = document.getElementById("today-task-list")
  taskList.innerHTML = ""

  todayTasks.forEach((task) => {
    const taskElement = document.createElement("div")
    taskElement.className = `task-item ${task.completed ? "completed" : ""}`
    taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} 
                   onchange="toggleTask(${task.id})">
            <div class="task-content">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
            </div>
            <div class="task-duration">${task.duration}</div>
        `
    taskList.appendChild(taskElement)
  })
}

function toggleTask(taskId) {
  const task = todayTasks.find((t) => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    loadTodayTasks()
    updateStats()
  }
}

function updateStats() {
  const completedTasks = todayTasks.filter((t) => t.completed).length
  document.getElementById("completed-tasks").textContent = completedTasks + 8 // +8 for previous tasks
}

function loadSchedule() {
  if (!currentGoal || !learningGoals[currentGoal]) return

  const schedule = learningGoals[currentGoal].weeks[currentWeek - 1]
  if (!schedule) return

  document.getElementById("current-week").textContent = `Week ${currentWeek}: ${schedule.title}`

  const scheduleGrid = document.getElementById("schedule-grid")
  scheduleGrid.innerHTML = ""

  schedule.days.forEach((day, index) => {
    const dayElement = document.createElement("div")
    dayElement.className = `day-card ${index === new Date().getDay() ? "today" : ""}`
    dayElement.innerHTML = `
            <div class="day-name">${day.name}</div>
            <div class="day-tasks">${day.tasks}</div>
        `
    scheduleGrid.appendChild(dayElement)
  })
}

function previousWeek() {
  if (currentWeek > 1) {
    currentWeek--
    loadSchedule()
  }
}

function nextWeek() {
  if (currentGoal && learningGoals[currentGoal] && currentWeek < learningGoals[currentGoal].weeks.length) {
    currentWeek++
    loadSchedule()
  }
}

function startAssessment() {
  alert("Assessment feature would open here. In a real implementation, this would navigate to a quiz interface.")
}

// AI Assistant functions
function toggleAI() {
  const assistant = document.getElementById("ai-assistant")
  const toggleBtn = document.getElementById("ai-toggle-btn")

  aiAssistantOpen = !aiAssistantOpen

  if (aiAssistantOpen) {
    assistant.classList.add("active")
    toggleBtn.style.display = "none"
  } else {
    assistant.classList.remove("active")
    toggleBtn.style.display = "block"
  }
}

function sendAIMessage() {
  const input = document.getElementById("ai-input-field")
  const message = input.value.trim()

  if (!message) return

  const chat = document.getElementById("ai-chat")

  // Add user message
  const userMessage = document.createElement("div")
  userMessage.className = "ai-message user-message"
  userMessage.innerHTML = `
        <div class="ai-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="ai-content">
            <p>${message}</p>
        </div>
    `
  chat.appendChild(userMessage)

  // Simulate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(message)
    const aiMessage = document.createElement("div")
    aiMessage.className = "ai-message"
    aiMessage.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-content">
                <p>${aiResponse}</p>
            </div>
        `
    chat.appendChild(aiMessage)
    chat.scrollTop = chat.scrollHeight
  }, 1000)

  input.value = ""
  chat.scrollTop = chat.scrollHeight
}

function generateAIResponse(message) {
  const responses = [
    "That's a great question! Based on your current progress in " +
      (currentGoal || "your course") +
      ", I'd recommend focusing on the fundamentals first.",
    "I can help you with that! Here are some additional resources that might be useful for your learning journey.",
    "It looks like you're making good progress! Remember to practice regularly and don't hesitate to ask if you need clarification on any concepts.",
    "That topic is covered in your upcoming lessons. For now, try to master the current concepts, and we'll build on them gradually.",
    "Great initiative! I suggest breaking this down into smaller, manageable tasks. Would you like me to help you create a study plan?",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("learnloop_user")
  const savedGoal = localStorage.getItem("learnloop_goal")

  if (savedUser && savedGoal) {
    currentUser = JSON.parse(savedUser)
    currentGoal = savedGoal
    showDashboard()
  } else {
    showPage("landing-page")
  }

  // Form event listeners
  document.getElementById("register-form").addEventListener("submit", handleRegister)
  document.getElementById("login-form").addEventListener("submit", handleLogin)

  // AI input enter key
  document.getElementById("ai-input-field").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendAIMessage()
    }
  })
})

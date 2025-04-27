// Main JavaScript file for MealMate

// Data structure in localStorage
// house: { id, name, managerId, mealSystem }
// mates: [{ id, name, email, role }]
// meals: [{ date, meals: { userId: mealCount } }]
// expenses: [{ date, amount, payerId, description }]
// currentUser: { id, name, email, role, houseId }

// Create global namespace for our utility functions
window.mealMateAuth = {}
window.mealMateCalculator = {}
window.mealMateUtils = {}

// Load utility modules
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load auth module
    const authModule = await import("./auth.js")
    window.mealMateAuth = authModule

    // Load meal calculator module
    const calculatorModule = await import("./meal_calculator.js")
    window.mealMateCalculator = calculatorModule

    // Load utils module
    const utilsModule = await import("./utils.js")
    window.mealMateUtils = utilsModule

    // Initialize user info after modules are loaded
    initUserInfo()
  } catch (error) {
    console.error("Error loading modules:", error)
  }
})

// Check if user is logged in
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (
    !currentUser &&
    !window.location.href.includes("index.html") &&
    !window.location.href.includes("create_house.html")
  ) {
    window.location.href = "index.html"
    return false
  }
  return true
}

// Initialize user info in navbar
function initUserInfo() {
  if (!checkAuth()) return

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) return

  // Set user info in dropdown
  const userNameElement = document.getElementById("userName")
  const userEmailElement = document.getElementById("userEmail")
  const userRoleElement = document.getElementById("userRole")

  if (userNameElement) userNameElement.textContent = currentUser.name
  if (userEmailElement) userEmailElement.textContent = currentUser.email
  if (userRoleElement) userRoleElement.textContent = currentUser.role === "manager" ? "Manager" : "Member"

  // Set user initial in avatar
  const userInitial = document.getElementById("userInitial")
  if (userInitial) {
    userInitial.textContent = currentUser.name.charAt(0).toUpperCase()
  }

  // Set house name in navbar
  const house = JSON.parse(localStorage.getItem("house"))
  if (house) {
    const houseNameElements = document.querySelectorAll("#houseName")
    houseNameElements.forEach((element) => {
      element.textContent = house.name
    })
  }

  // Setup logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("currentUser")
      window.location.href = "index.html"
    })
  }

  // Toggle sidebar on mobile
  const toggleSidebarMobile = document.getElementById("toggleSidebarMobile")
  const sidebar = document.getElementById("sidebar")

  if (toggleSidebarMobile && sidebar) {
    toggleSidebarMobile.addEventListener("click", () => {
      sidebar.classList.toggle("hidden")
    })
  }
}

// Format currency
function formatCurrency(amount) {
  return "$" + Number.parseFloat(amount).toFixed(2)
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

// Get user by ID
function getUserById(userId) {
  const mates = JSON.parse(localStorage.getItem("mates")) || []
  return mates.find((mate) => mate.id === userId) || null
}

// Calculate meal rate
function calculateMealRate() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || []
  const meals = JSON.parse(localStorage.getItem("meals")) || []

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

  // Calculate total meals
  let totalMeals = 0
  meals.forEach((mealEntry) => {
    const mealCounts = mealEntry.meals
    for (const userId in mealCounts) {
      totalMeals += Number.parseInt(mealCounts[userId])
    }
  })

  // Calculate meal rate
  const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0

  return {
    totalExpenses,
    totalMeals,
    mealRate,
  }
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

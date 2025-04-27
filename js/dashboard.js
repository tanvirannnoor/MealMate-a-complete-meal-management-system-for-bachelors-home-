// Dashboard JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Import required functions
    const { checkAuth } = window.mealMateAuth || {}
    const { calculateMealRate } = window.mealMateCalculator || {}
    const { formatCurrency } = window.mealMateUtils || {}
  
    if (!checkAuth()) return
  
    // Load dashboard data
    loadDashboardData()
  
    function loadDashboardData() {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))
      if (!currentUser) return
  
      // Get house data
      const house = JSON.parse(localStorage.getItem("house"))
      if (!house) return
  
      // Get mates data
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Update house information section
      document.getElementById("dashboardHouseName").textContent = house.name
      document.getElementById("mealSystem").textContent =
        `${house.mealSystem} meal${house.mealSystem > 1 ? "s" : ""} per day`
      document.getElementById("totalMembers").textContent = mates.length
      document.getElementById("dashboardUserRole").textContent = currentUser.role === "manager" ? "Manager" : "Member"
  
      // Calculate and update summary stats
      const { totalExpenses, totalMeals, mealRate } = calculateMealRate()
  
      document.getElementById("totalMeals").textContent = totalMeals
      document.getElementById("totalExpenses").textContent = formatCurrency(totalExpenses)
      document.getElementById("mealRate").textContent = formatCurrency(mealRate)
    }
  })
  
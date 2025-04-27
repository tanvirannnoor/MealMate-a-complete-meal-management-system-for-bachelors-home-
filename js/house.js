// House management JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Function to generate a unique ID
    function generateId() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  
    // Handle create house form submission
    const createHouseForm = document.getElementById("createHouseForm")
  
    if (createHouseForm) {
      createHouseForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const houseName = document.getElementById("houseName").value
        const yourName = document.getElementById("yourName").value
        const yourEmail = document.getElementById("yourEmail").value
  
        // Generate IDs
        const houseId = generateId()
        const userId = generateId()
  
        // Create house object
        const house = {
          id: houseId,
          name: houseName,
          managerId: userId,
          mealSystem: 3, // Default to 3 meals per day
        }
  
        // Create user object
        const user = {
          id: userId,
          name: yourName,
          email: yourEmail,
          role: "manager",
          houseId: houseId,
        }
  
        // Create initial mates array with the creator
        const mates = [user]
  
        // Save to localStorage
        localStorage.setItem("house", JSON.stringify(house))
        localStorage.setItem("mates", JSON.stringify(mates))
        localStorage.setItem("meals", JSON.stringify([]))
        localStorage.setItem("expenses", JSON.stringify([]))
        localStorage.setItem("currentUser", JSON.stringify(user))
  
        // Redirect to dashboard
        window.location.href = "dashboard.html"
      })
    }
  })
  
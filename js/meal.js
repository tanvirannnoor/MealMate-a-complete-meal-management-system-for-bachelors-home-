// Meal system and entry JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Import required functions
    const { checkAuth } = window.mealMateAuth || {}
  
    if (!checkAuth()) return
  
    // Check if user is manager for meal system page
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const managerControls = document.getElementById("managerControls")
    const memberView = document.getElementById("memberView")
  
    if (managerControls && memberView) {
      // We're on the meal system page
      if (currentUser.role === "manager") {
        managerControls.classList.remove("hidden")
      } else {
        memberView.classList.remove("hidden")
      }
  
      // Load current meal system
      loadMealSystem()
  
      // Handle meal system form submission
      const mealSystemForm = document.getElementById("mealSystemForm")
      if (mealSystemForm) {
        mealSystemForm.addEventListener("submit", (e) => {
          e.preventDefault()
  
          // Get selected meal system
          const mealSystem = document.querySelector('input[name="mealSystem"]:checked').value
  
          // Update house meal system
          updateMealSystem(Number.parseInt(mealSystem))
  
          alert("Meal system updated successfully!")
  
          // Reload meal system
          loadMealSystem()
        })
      }
    }
  
    // Check if we're on the meal entry page
    const mealEntryForm = document.getElementById("mealEntryForm")
    if (mealEntryForm) {
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0]
      document.getElementById("mealDate").value = today
  
      // Load current meal system info
      const house = JSON.parse(localStorage.getItem("house"))
      if (house) {
        document.getElementById("currentMealSystem").textContent =
          `${house.mealSystem} meal${house.mealSystem > 1 ? "s" : ""} per day`
      }
  
      // Load mates for meal entry
      loadMatesForMealEntry()
  
      // Handle meal entry form submission
      mealEntryForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Save meal entry
        saveMealEntry()
  
        alert("Meal entry saved successfully!")
  
        // Reset form
        document.getElementById("mealDate").value = today
        loadMatesForMealEntry()
      })
    }
  
    function loadMealSystem() {
      // Get house data
      const house = JSON.parse(localStorage.getItem("house"))
      if (!house) return
  
      // Set current meal system in member view
      const currentMealSystem = document.getElementById("currentMealSystem")
      if (currentMealSystem) {
        currentMealSystem.textContent = `${house.mealSystem} meal${house.mealSystem > 1 ? "s" : ""} per day`
      }
  
      // Set selected radio button in manager view
      const radioButton = document.getElementById(
        `${house.mealSystem === 1 ? "one" : house.mealSystem === 2 ? "two" : "three"}-meals`,
      )
      if (radioButton) {
        radioButton.checked = true
      }
    }
  
    function updateMealSystem(mealSystem) {
      // Get house data
      const house = JSON.parse(localStorage.getItem("house"))
      if (!house) return
  
      // Update meal system
      house.mealSystem = mealSystem
  
      // Save to localStorage
      localStorage.setItem("house", JSON.stringify(house))
    }
  
    function loadMatesForMealEntry() {
      const mealEntryContainer = document.getElementById("mealEntryContainer")
      if (!mealEntryContainer) return
  
      // Get house data
      const house = JSON.parse(localStorage.getItem("house"))
      if (!house) return
  
      // Get mates data
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Clear existing entries
      mealEntryContainer.innerHTML = ""
  
      // Add each mate to the form
      mates.forEach((mate) => {
        const mateDiv = document.createElement("div")
        mateDiv.className = "flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
  
        const mateInfo = document.createElement("div")
        mateInfo.className = "flex items-center"
  
        const mateInitial = document.createElement("div")
        mateInitial.className =
          "w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-medium mr-3"
        mateInitial.textContent = mate.name.charAt(0).toUpperCase()
  
        const mateName = document.createElement("div")
        mateName.className = "text-sm font-medium text-gray-900"
        mateName.textContent = mate.name
  
        mateInfo.appendChild(mateInitial)
        mateInfo.appendChild(mateName)
  
        const mealCountInput = document.createElement("div")
        mealCountInput.className = "flex items-center"
  
        // Create number input for meal count
        const input = document.createElement("input")
        input.type = "number"
        input.min = "0"
        input.max = house.mealSystem.toString()
        input.value = "0"
        input.className =
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-16 p-2.5"
        input.id = `mealCount_${mate.id}`
        input.name = `mealCount_${mate.id}`
  
        const maxLabel = document.createElement("span")
        maxLabel.className = "text-xs text-gray-500 ml-2"
        maxLabel.textContent = `/ ${house.mealSystem}`
  
        mealCountInput.appendChild(input)
        mealCountInput.appendChild(maxLabel)
  
        mateDiv.appendChild(mateInfo)
        mateDiv.appendChild(mealCountInput)
  
        mealEntryContainer.appendChild(mateDiv)
      })
    }
  
    function saveMealEntry() {
      // Get date
      const date = document.getElementById("mealDate").value
  
      // Get mates data
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Get existing meals data
      const meals = JSON.parse(localStorage.getItem("meals")) || []
  
      // Check if entry for this date already exists
      const existingEntryIndex = meals.findIndex((entry) => entry.date === date)
  
      // Create meals object
      const mealCounts = {}
      mates.forEach((mate) => {
        const mealCount = document.getElementById(`mealCount_${mate.id}`).value
        mealCounts[mate.id] = Number.parseInt(mealCount)
      })
  
      if (existingEntryIndex !== -1) {
        // Update existing entry
        meals[existingEntryIndex].meals = mealCounts
      } else {
        // Create new entry
        meals.push({
          date: date,
          meals: mealCounts,
        })
      }
  
      // Sort meals by date (newest first)
      meals.sort((a, b) => new Date(b.date) - new Date(a.date))
  
      // Save to localStorage
      localStorage.setItem("meals", JSON.stringify(meals))
    }
  })
  
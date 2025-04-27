// House mates management JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Import required functions
    const { checkAuth } = window.mealMateAuth || {}
    const { generateId } = window.mealMateUtils || {}
    const { Modal } = window // Access the Flowbite Modal object through the window
  
    if (!checkAuth()) return
  
    // Check if user is manager
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const managerControls = document.getElementById("managerControls")
  
    if (currentUser.role === "manager" && managerControls) {
      managerControls.classList.remove("hidden")
    }
  
    // Load mates list
    loadMatesList()
  
    // Handle invite form submission
    const inviteForm = document.getElementById("inviteForm")
    if (inviteForm) {
      inviteForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const mateName = document.getElementById("mateName").value
        const mateEmail = document.getElementById("mateEmail").value
  
        // Add new mate
        addMate(mateName, mateEmail)
  
        // Close modal
        const modal = document.getElementById("inviteModal")
        if (modal) {
          // Access the Flowbite Modal object through the window
          const modalInstance = new Modal(modal)
          modalInstance.hide()
        }
  
        // Reset form
        inviteForm.reset()
  
        // Reload mates list
        loadMatesList()
      })
    }
  
    function loadMatesList() {
      const matesList = document.getElementById("matesList")
      if (!matesList) return
  
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))
      if (!currentUser) return
  
      // Get mates data
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Clear existing list
      matesList.innerHTML = ""
  
      // Add each mate to the list
      mates.forEach((mate) => {
        const row = document.createElement("tr")
        row.className = "bg-white border-b"
  
        // Name column
        const nameCell = document.createElement("td")
        nameCell.className = "px-4 py-3"
        nameCell.textContent = mate.name
        row.appendChild(nameCell)
  
        // Email column
        const emailCell = document.createElement("td")
        emailCell.className = "px-4 py-3"
        emailCell.textContent = mate.email
        row.appendChild(emailCell)
  
        // Role column
        const roleCell = document.createElement("td")
        roleCell.className = "px-4 py-3"
        const roleSpan = document.createElement("span")
        roleSpan.className =
          mate.role === "manager"
            ? "bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded"
            : "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
        roleSpan.textContent = mate.role === "manager" ? "Manager" : "Member"
        roleCell.appendChild(roleSpan)
        row.appendChild(roleCell)
  
        // Actions column
        const actionsCell = document.createElement("td")
        actionsCell.className = "px-4 py-3"
  
        // Only show actions if current user is a manager
        if (currentUser.role === "manager") {
          // Don't show promote/demote for self
          if (mate.id !== currentUser.id) {
            const actionButton = document.createElement("button")
            actionButton.className = "text-xs font-medium text-gray-700 hover:text-gray-900"
            actionButton.textContent = mate.role === "manager" ? "Demote to Member" : "Promote to Manager"
            actionButton.addEventListener("click", () => {
              toggleMateRole(mate.id)
            })
            actionsCell.appendChild(actionButton)
          } else {
            actionsCell.textContent = "You"
          }
        } else {
          actionsCell.textContent = "-"
        }
  
        row.appendChild(actionsCell)
        matesList.appendChild(row)
      })
    }
  
    function addMate(name, email) {
      // Get current house
      const house = JSON.parse(localStorage.getItem("house"))
      if (!house) return
  
      // Get existing mates
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Check if email already exists
      const existingMate = mates.find((mate) => mate.email === email)
      if (existingMate) {
        alert("A mate with this email already exists.")
        return
      }
  
      // Create new mate
      const newMate = {
        id: generateId(),
        name: name,
        email: email,
        role: "member",
        houseId: house.id,
      }
  
      // Add to mates array
      mates.push(newMate)
  
      // Save to localStorage
      localStorage.setItem("mates", JSON.stringify(mates))
    }
  
    function toggleMateRole(mateId) {
      // Get existing mates
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Find the mate
      const mateIndex = mates.findIndex((mate) => mate.id === mateId)
      if (mateIndex === -1) return
  
      // Toggle role
      mates[mateIndex].role = mates[mateIndex].role === "manager" ? "member" : "manager"
  
      // Save to localStorage
      localStorage.setItem("mates", JSON.stringify(mates))
  
      // Reload mates list
      loadMatesList()
    }
  })
  
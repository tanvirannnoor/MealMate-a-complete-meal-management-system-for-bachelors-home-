// Expense entry JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Import required functions
    const { checkAuth } = window.mealMateAuth || {}
    const { generateId } = window.mealMateUtils || {}
  
    if (!checkAuth()) return
  
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("expenseDate").value = today
  
    // Load mates for expense payer dropdown
    loadMatesForExpensePayer()
  
    // Handle expense entry form submission
    const expenseEntryForm = document.getElementById("expenseEntryForm")
    if (expenseEntryForm) {
      expenseEntryForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Save expense entry
        saveExpenseEntry()
  
        alert("Expense saved successfully!")
  
        // Reset form
        document.getElementById("expenseDate").value = today
        document.getElementById("expenseAmount").value = ""
        document.getElementById("expensePayer").value = ""
        document.getElementById("expenseDescription").value = ""
      })
    }
  
    function loadMatesForExpensePayer() {
      const expensePayer = document.getElementById("expensePayer")
      if (!expensePayer) return
  
      // Get mates data
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Clear existing options
      expensePayer.innerHTML = '<option value="" disabled selected>Select who paid</option>'
  
      // Add each mate as an option
      mates.forEach((mate) => {
        const option = document.createElement("option")
        option.value = mate.id
        option.textContent = mate.name
        expensePayer.appendChild(option)
      })
    }
  
    function saveExpenseEntry() {
      // Get form values
      const date = document.getElementById("expenseDate").value
      const amount = document.getElementById("expenseAmount").value
      const payerId = document.getElementById("expensePayer").value
      const description = document.getElementById("expenseDescription").value
  
      // Get existing expenses data
      const expenses = JSON.parse(localStorage.getItem("expenses")) || []
  
      // Create new expense entry
      const newExpense = {
        id: generateId(),
        date: date,
        amount: Number.parseFloat(amount),
        payerId: payerId,
        description: description,
      }
  
      // Add to expenses array
      expenses.push(newExpense)
  
      // Sort expenses by date (newest first)
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date))
  
      // Save to localStorage
      localStorage.setItem("expenses", JSON.stringify(expenses))
    }
  })
  
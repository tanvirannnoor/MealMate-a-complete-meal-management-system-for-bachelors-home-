// Reports JavaScript for MealMate

document.addEventListener("DOMContentLoaded", () => {
    // Import required functions
    const { checkAuth } = window.mealMateAuth || {}
    const { formatCurrency, formatDate, getUserById } = window.mealMateUtils || {}
  
    if (!checkAuth()) return
  
    // Set today's date as default
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("reportDate").value = today
  
    // Set current week as default
    const currentDate = new Date()
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((currentDate - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
    document.getElementById("reportWeek").value =
      `${currentDate.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`
  
    // Set current month as default
    document.getElementById("reportMonth").value =
      `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`
  
    // Set daily report as default active tab
    setActiveReportTab("daily")
  
    // Add event listeners to report tabs
    const reportTabs = document.querySelectorAll(".report-tab")
    reportTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const reportType = this.getAttribute("data-type")
        setActiveReportTab(reportType)
      })
    })
  
    // Handle mobile report type selector
    const reportTypeSelect = document.getElementById("reportType")
    if (reportTypeSelect) {
      reportTypeSelect.addEventListener("change", function () {
        setActiveReportTab(this.value)
      })
    }
  
    // Handle generate report button
    const generateReportBtn = document.getElementById("generateReportBtn")
    if (generateReportBtn) {
      generateReportBtn.addEventListener("click", () => {
        generateReport()
      })
    }
  
    // Handle print report button
    const printReportBtn = document.getElementById("printReportBtn")
    if (printReportBtn) {
      printReportBtn.addEventListener("click", () => {
        window.print()
      })
    }
  
    function setActiveReportTab(reportType) {
      // Update tab styling
      const reportTabs = document.querySelectorAll(".report-tab")
      reportTabs.forEach((tab) => {
        if (tab.getAttribute("data-type") === reportType) {
          tab.classList.add("active", "border-emerald-600", "text-emerald-600")
          tab.classList.remove("border-transparent", "text-gray-500")
        } else {
          tab.classList.remove("active", "border-emerald-600", "text-emerald-600")
          tab.classList.add("border-transparent", "text-gray-500")
        }
      })
  
      // Update mobile selector
      const reportTypeSelect = document.getElementById("reportType")
      if (reportTypeSelect) {
        reportTypeSelect.value = reportType
      }
  
      // Show/hide appropriate date selectors
      document.getElementById("reportDate").parentElement.classList.add("hidden")
      document.getElementById("weekSelector").classList.add("hidden")
      document.getElementById("monthSelector").classList.add("hidden")
  
      if (reportType === "daily") {
        document.getElementById("reportDate").parentElement.classList.remove("hidden")
      } else if (reportType === "weekly") {
        document.getElementById("weekSelector").classList.remove("hidden")
      } else if (reportType === "monthly") {
        document.getElementById("monthSelector").classList.remove("hidden")
      }
    }
  
    function generateReport() {
      // Get active report type
      const activeTab = document.querySelector(".report-tab.active")
      const reportType = activeTab ? activeTab.getAttribute("data-type") : "daily"
  
      // Get date range based on report type
      let startDate, endDate
  
      if (reportType === "daily") {
        const reportDate = document.getElementById("reportDate").value
        startDate = new Date(reportDate)
        endDate = new Date(reportDate)
        endDate.setHours(23, 59, 59, 999)
      } else if (reportType === "weekly") {
        const reportWeek = document.getElementById("reportWeek").value
        const [year, week] = reportWeek.split("-W")
        startDate = getDateOfISOWeek(Number.parseInt(week), Number.parseInt(year))
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
      } else if (reportType === "monthly") {
        const reportMonth = document.getElementById("reportMonth").value
        const [year, month] = reportMonth.split("-")
        startDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
        endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0)
        endDate.setHours(23, 59, 59, 999)
      }
  
      // Get data for the date range
      const reportData = getReportData(startDate, endDate)
  
      // Display report
      displayReport(reportData, reportType, startDate, endDate)
    }
  
    function getDateOfISOWeek(week, year) {
      const simple = new Date(year, 0, 1 + (week - 1) * 7)
      const dow = simple.getDay()
      const ISOweekStart = simple
      if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
      } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
      }
      return ISOweekStart
    }
  
    function getReportData(startDate, endDate) {
      // Get all data
      const meals = JSON.parse(localStorage.getItem("meals")) || []
      const expenses = JSON.parse(localStorage.getItem("expenses")) || []
      const mates = JSON.parse(localStorage.getItem("mates")) || []
  
      // Filter data for the date range
      const filteredMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.date)
        return mealDate >= startDate && mealDate <= endDate
      })
  
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= startDate && expenseDate <= endDate
      })
  
      // Calculate totals
      const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)
  
      // Calculate total meals
      let totalMeals = 0
      const mealsByMate = {}
  
      // Initialize mealsByMate with all mates
      mates.forEach((mate) => {
        mealsByMate[mate.id] = 0
      })
  
      // Sum up meals for each mate
      filteredMeals.forEach((mealEntry) => {
        const mealCounts = mealEntry.meals
        for (const userId in mealCounts) {
          const mealCount = Number.parseInt(mealCounts[userId])
          totalMeals += mealCount
          mealsByMate[userId] = (mealsByMate[userId] || 0) + mealCount
        }
      })
  
      // Calculate meal rate
      const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0
  
      // Calculate expenses paid by each mate
      const expensesByMate = {}
  
      // Initialize expensesByMate with all mates
      mates.forEach((mate) => {
        expensesByMate[mate.id] = 0
      })
  
      // Sum up expenses for each mate
      filteredExpenses.forEach((expense) => {
        expensesByMate[expense.payerId] = (expensesByMate[expense.payerId] || 0) + Number.parseFloat(expense.amount)
      })
  
      // Calculate balance for each mate
      const mateDetails = mates.map((mate) => {
        const mealCount = mealsByMate[mate.id] || 0
        const mealCost = mealCount * mealRate
        const expensesPaid = expensesByMate[mate.id] || 0
        const balance = expensesPaid - mealCost
  
        return {
          id: mate.id,
          name: mate.name,
          mealCount,
          mealCost,
          expensesPaid,
          balance,
        }
      })
  
      return {
        totalMeals,
        totalExpenses,
        mealRate,
        mateDetails,
        filteredExpenses,
      }
    }
  
    function displayReport(reportData, reportType, startDate, endDate) {
      // Show report content, hide no data message
      document.getElementById("reportContent").classList.remove("hidden")
      document.getElementById("noDataMessage").classList.add("hidden")
  
      // Update summary
      document.getElementById("summaryTotalMeals").textContent = reportData.totalMeals
      document.getElementById("summaryTotalExpenses").textContent = formatCurrency(reportData.totalExpenses)
      document.getElementById("summaryMealRate").textContent = formatCurrency(reportData.mealRate)
  
      // Update member details
      const memberDetailsList = document.getElementById("memberDetailsList")
      memberDetailsList.innerHTML = ""
  
      reportData.mateDetails.forEach((mate) => {
        const row = document.createElement("tr")
        row.className = "bg-white border-b"
  
        // Name column
        const nameCell = document.createElement("td")
        nameCell.className = "px-4 py-3"
        nameCell.textContent = mate.name
        row.appendChild(nameCell)
  
        // Total Meals column
        const mealsCell = document.createElement("td")
        mealsCell.className = "px-4 py-3"
        mealsCell.textContent = mate.mealCount
        row.appendChild(mealsCell)
  
        // Expenses Paid column
        const expensesCell = document.createElement("td")
        expensesCell.className = "px-4 py-3"
        expensesCell.textContent = formatCurrency(mate.expensesPaid)
        row.appendChild(expensesCell)
  
        // Balance column
        const balanceCell = document.createElement("td")
        balanceCell.className = "px-4 py-3"
        const balanceText = formatCurrency(mate.balance)
        balanceCell.textContent = balanceText
        balanceCell.className = `px-4 py-3 ${mate.balance >= 0 ? "text-emerald-600" : "text-red-600"}`
        row.appendChild(balanceCell)
  
        memberDetailsList.appendChild(row)
      })
  
      // Update expense details
      const expenseDetailsList = document.getElementById("expenseDetailsList")
      expenseDetailsList.innerHTML = ""
  
      if (reportData.filteredExpenses.length === 0) {
        const row = document.createElement("tr")
        row.className = "bg-white border-b"
  
        const cell = document.createElement("td")
        cell.className = "px-4 py-3 text-center text-gray-500"
        cell.colSpan = 4
        cell.textContent = "No expenses found for this period"
  
        row.appendChild(cell)
        expenseDetailsList.appendChild(row)
      } else {
        reportData.filteredExpenses.forEach((expense) => {
          const row = document.createElement("tr")
          row.className = "bg-white border-b"
  
          // Date column
          const dateCell = document.createElement("td")
          dateCell.className = "px-4 py-3"
          dateCell.textContent = formatDate(expense.date)
          row.appendChild(dateCell)
  
          // Amount column
          const amountCell = document.createElement("td")
          amountCell.className = "px-4 py-3"
          amountCell.textContent = formatCurrency(expense.amount)
          row.appendChild(amountCell)
  
          // Paid By column
          const paidByCell = document.createElement("td")
          paidByCell.className = "px-4 py-3"
          const payer = getUserById(expense.payerId)
          paidByCell.textContent = payer ? payer.name : "Unknown"
          row.appendChild(paidByCell)
  
          // Description column
          const descriptionCell = document.createElement("td")
          descriptionCell.className = "px-4 py-3"
          descriptionCell.textContent = expense.description || "-"
          row.appendChild(descriptionCell)
  
          expenseDetailsList.appendChild(row)
        })
      }
    }
  })
  
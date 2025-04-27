// Meal calculation utilities for MealMate

/**
 * Calculate meal rate based on expenses and meals
 * @returns {Object} Object containing totalExpenses, totalMeals, and mealRate
 */
export function calculateMealRate() {
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
  
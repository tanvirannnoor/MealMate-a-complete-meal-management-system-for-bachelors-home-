// Authentication utilities for MealMate

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function checkAuth() {
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
  
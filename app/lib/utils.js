import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Converts minutes to a formatted hours and minutes string
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted string (e.g., "1h 30m" or "45m")
 */
export function convertMinutesToHours(minutes) {
  if (!minutes) return "0h 0m";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
}

export function truncateText(text, limit) {
  if (!text) return "";

  if (text.length <= limit) {
    return text;
  }

  return text.slice(0, limit) + "...";
}

/**
 * Formats a date string into a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "";

  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function formatPrice(price) {
  if (price === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

// Simple test function to check import functionality
export function testFunction() {
  return "Test function works!";
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

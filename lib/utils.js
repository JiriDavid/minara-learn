import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertMinutesToHours(minutes) {
  if (!minutes) return "0 min";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} min`;
  }
}

export function formatPrice(price) {
  if (price === 0) return "Free";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function truncateText(text, maxLength) {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Formats a date string into a more readable format
 * @param {string|Date} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

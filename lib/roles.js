/**
 * Role-based access control utilities
 */

export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    "view_all_users",
    "manage_users",
    "manage_all_courses",
    "view_analytics",
    "system_settings",
  ],
  [USER_ROLES.INSTRUCTOR]: [
    "create_courses",
    "manage_own_courses",
    "view_own_students",
    "grade_assignments",
    "view_course_analytics",
  ],
  [USER_ROLES.STUDENT]: [
    "enroll_courses",
    "view_enrolled_courses",
    "submit_assignments",
    "view_own_progress",
  ],
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if user has permission
 */
export function hasPermission(userRole, permission) {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified roles
 * @param {string} userRole - The user's role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean} - True if user has one of the allowed roles
 */
export function hasRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(userRole) {
  return userRole === USER_ROLES.ADMIN;
}

/**
 * Check if user is instructor or admin
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is instructor or admin
 */
export function isInstructor(userRole) {
  return hasRole(userRole, [USER_ROLES.INSTRUCTOR, USER_ROLES.ADMIN]);
}

/**
 * Check if user is student
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is student
 */
export function isStudent(userRole) {
  return userRole === USER_ROLES.STUDENT;
}

/**
 * Get dashboard route based on user role
 * @param {string} userRole - The user's role
 * @returns {string} - Dashboard route for the role
 */
export function getDashboardRoute(userRole) {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return "/dashboard/admin";
    case USER_ROLES.INSTRUCTOR:
      return "/dashboard/instructor";
    case USER_ROLES.STUDENT:
      return "/dashboard/student";
    default:
      return "/dashboard";
  }
}

/**
 * Get role display name
 * @param {string} role - The role
 * @returns {string} - Display name for the role
 */
export function getRoleDisplayName(role) {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "Administrator";
    case USER_ROLES.INSTRUCTOR:
      return "Instructor";
    case USER_ROLES.STUDENT:
      return "Student";
    default:
      return "User";
  }
}

/**
 * Get role color for UI styling
 * @param {string} role - The role
 * @returns {string} - Tailwind color class
 */
export function getRoleColor(role) {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "bg-red-100 text-red-800 border-red-200";
    case USER_ROLES.INSTRUCTOR:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case USER_ROLES.STUDENT:
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

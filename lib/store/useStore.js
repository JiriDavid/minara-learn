import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Course state
      courses: [],
      setCourses: (courses) => set({ courses }),
      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (updatedCourse) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          ),
        })),
      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((course) => course._id !== courseId),
        })),

      // Enrollment state
      enrollments: [],
      setEnrollments: (enrollments) => set({ enrollments }),
      addEnrollment: (enrollment) =>
        set((state) => ({ enrollments: [...state.enrollments, enrollment] })),
      updateEnrollment: (updatedEnrollment) =>
        set((state) => ({
          enrollments: state.enrollments.map((enrollment) =>
            enrollment._id === updatedEnrollment._id
              ? updatedEnrollment
              : enrollment
          ),
        })),
      removeEnrollment: (enrollmentId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (enrollment) => enrollment._id !== enrollmentId
          ),
        })),

      // Learning progress state
      currentCourse: null,
      setCurrentCourse: (course) => set({ currentCourse: course }),
      currentLesson: null,
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      completedLessons: [],
      setCompletedLessons: (lessons) => set({ completedLessons: lessons }),
      addCompletedLesson: (lessonId) =>
        set((state) => ({
          completedLessons: [...state.completedLessons, lessonId],
        })),

      // UI state
      sidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
      theme: "light",
      setTheme: (theme) => set({ theme }),

      // Search state
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),

      // Clear state
      clearState: () =>
        set({
          user: null,
          courses: [],
          enrollments: [],
          currentCourse: null,
          currentLesson: null,
          completedLessons: [],
          searchQuery: "",
          searchResults: [],
        }),
    }),
    {
      name: "e-x-tra-lms-storage",
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        completedLessons: state.completedLessons,
      }),
    }
  )
);

export default useStore;

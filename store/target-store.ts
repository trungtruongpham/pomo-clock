import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Target {
  id: string
  label: string
  description: string
  icon: string
  color: string
}

// Preset targets for common focus activities
export const PRESET_TARGETS: Target[] = [
  {
    id: "study",
    label: "Study Session",
    description: "Deep learning & reading",
    icon: "BookOpen",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "work",
    label: "Work Tasks",
    description: "Projects & deadlines",
    icon: "Briefcase",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "coding",
    label: "Coding",
    description: "Development & debugging",
    icon: "Code",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "writing",
    label: "Writing",
    description: "Articles, essays & notes",
    icon: "PenTool",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "creative",
    label: "Creative Work",
    description: "Design & brainstorming",
    icon: "Palette",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "planning",
    label: "Planning",
    description: "Organizing & scheduling",
    icon: "Calendar",
    color: "from-cyan-500 to-sky-500",
  },
]

interface TargetState {
  activeTarget: Target | null
  completedPomodoros: number
  sessionStartTime: Date | null
  totalFocusMinutes: number

  // Actions
  setTarget: (target: Target) => void
  incrementCompleted: () => void
  clearTarget: () => void
  addFocusMinutes: (minutes: number) => void
}

export const useTargetStore = create<TargetState>()(
  persist(
    (set) => ({
      activeTarget: null,
      completedPomodoros: 0,
      sessionStartTime: null,
      totalFocusMinutes: 0,

      setTarget: (target) =>
        set({
          activeTarget: target,
          completedPomodoros: 0,
          sessionStartTime: new Date(),
        }),

      incrementCompleted: () =>
        set((state) => ({
          completedPomodoros: state.completedPomodoros + 1,
        })),

      clearTarget: () =>
        set({
          activeTarget: null,
          completedPomodoros: 0,
          sessionStartTime: null,
        }),

      addFocusMinutes: (minutes) =>
        set((state) => ({
          totalFocusMinutes: state.totalFocusMinutes + minutes,
        })),
    }),
    {
      name: "pomostudy-target",
    }
  )
)


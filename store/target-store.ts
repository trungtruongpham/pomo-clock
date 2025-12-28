import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Target {
  id: string
  label: string
  description: string
  icon: string
  color: string
  isCustom?: boolean
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
  customTargets: Target[]

  // Actions
  setTarget: (target: Target) => void
  incrementCompleted: () => void
  clearTarget: () => void
  addFocusMinutes: (minutes: number) => void
  setCompletedPomodoros: (count: number) => void
  setTotalFocusMinutes: (minutes: number) => void
  addCustomTarget: (target: Target) => void
  removeCustomTarget: (targetId: string) => void
  setCustomTargets: (targets: Target[]) => void
}

export const useTargetStore = create<TargetState>()(
  persist(
    (set) => ({
      activeTarget: null,
      completedPomodoros: 0,
      sessionStartTime: null,
      totalFocusMinutes: 0,
      customTargets: [],

      setTarget: (target) =>
        set({
          activeTarget: target,
          completedPomodoros: 0,
          totalFocusMinutes: 0,
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
          totalFocusMinutes: 0,
          sessionStartTime: null,
        }),

      addFocusMinutes: (minutes) =>
        set((state) => ({
          totalFocusMinutes: state.totalFocusMinutes + minutes,
        })),

      setCompletedPomodoros: (count) =>
        set({
          completedPomodoros: count,
        }),

      setTotalFocusMinutes: (minutes) =>
        set({
          totalFocusMinutes: minutes,
        }),

      addCustomTarget: (target) =>
        set((state) => ({
          customTargets: [...state.customTargets, { ...target, isCustom: true }],
        })),

      removeCustomTarget: (targetId) =>
        set((state) => ({
          customTargets: state.customTargets.filter((t) => t.id !== targetId),
        })),

      setCustomTargets: (targets) =>
        set({
          customTargets: targets.map((t) => ({ ...t, isCustom: true })),
        }),
    }),
    {
      name: "pomostudy-target",
    }
  )
)


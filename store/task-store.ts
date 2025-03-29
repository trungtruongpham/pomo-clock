import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, estimatedPomodoros: number) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (taskId: string) => void;
  setActiveTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  incrementCompletedPomodoros: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title, estimatedPomodoros) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              title,
              estimatedPomodoros,
              completedPomodoros: 0,
              isCompleted: false,
              isActive: state.tasks.length === 0, // Make first task active by default
              createdAt: new Date(),
            },
          ],
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      setActiveTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => ({
            ...task,
            isActive: task.id === taskId,
          })),
        })),

      clearCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.isCompleted),
        })),

      incrementCompletedPomodoros: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completedPomodoros: task.completedPomodoros + 1,
                  isCompleted:
                    task.completedPomodoros + 1 >= task.estimatedPomodoros,
                }
              : task
          ),
        })),

      toggleTaskCompleted: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          ),
        })),
    }),
    {
      name: "pomostudy-tasks",
    }
  )
);

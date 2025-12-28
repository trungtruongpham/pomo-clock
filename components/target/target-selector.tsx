"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Code,
  PenTool,
  Palette,
  Calendar,
  Plus,
  Music,
  Dumbbell,
  Heart,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  Camera,
  Utensils,
  Plane,
  Trash2,
} from "lucide-react";
import { PRESET_TARGETS, Target, useTargetStore } from "@/store/target-store";
import { cn } from "@/lib/utils";
import { CustomTargetModal } from "./custom-target-modal";
import {
  getCustomTargets,
  saveCustomTarget,
  deleteCustomTarget,
} from "@/app/actions/target-actions";
import { toast } from "sonner";

interface TargetSelectorProps {
  onSelect: (target: Target) => void;
}

const TARGET_ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
  Dumbbell: <Dumbbell className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Utensils: <Utensils className="w-6 h-6" />,
  Plane: <Plane className="w-6 h-6" />,
};

export function TargetSelector({ onSelect }: TargetSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { customTargets, addCustomTarget, setCustomTargets, removeCustomTarget } =
    useTargetStore();

  // Fetch custom targets from database on mount
  const fetchCustomTargets = useCallback(async () => {
    const result = await getCustomTargets();
    if (result.success && result.data) {
      const targets = result.data.map((t) => ({
        id: t.target_id,
        label: t.label,
        description: t.description || "Custom target",
        icon: t.icon,
        color: t.color,
        isCustom: true,
      }));
      setCustomTargets(targets);
    }
  }, [setCustomTargets]);

  useEffect(() => {
    setMounted(true);
    fetchCustomTargets();
  }, [fetchCustomTargets]);

  async function handleSaveCustomTarget(target: Target) {
    // Save to database
    const result = await saveCustomTarget({
      target_id: target.id,
      label: target.label,
      description: target.description,
      icon: target.icon,
      color: target.color,
    });

    if (result.success) {
      // Add to local store
      addCustomTarget(target);
      toast.success("Custom target created!");
    } else {
      // If save fails (e.g., user not logged in), still add to local store
      addCustomTarget(target);
      toast.info("Target saved locally. Sign in to sync across devices.");
    }
  }

  async function handleDeleteCustomTarget(
    e: React.MouseEvent,
    targetId: string
  ) {
    e.stopPropagation();

    // Delete from database
    const result = await deleteCustomTarget(targetId);

    if (result.success) {
      removeCustomTarget(targetId);
      toast.success("Target removed");
    } else {
      // Still remove from local if DB fails
      removeCustomTarget(targetId);
    }
  }

  // Combine preset and custom targets
  const allTargets = [...PRESET_TARGETS, ...(mounted ? customTargets : [])];

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          What are you focusing on?
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose your target to start your focus session
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {allTargets.map((target, index) => (
            <motion.button
              key={target.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(target)}
              className={cn(
                "group relative flex flex-col items-center gap-3 p-4 rounded-xl",
                "bg-card border border-border",
                "hover:border-primary/50 hover:bg-accent/50",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  "bg-gradient-to-br text-white",
                  target.color
                )}
              >
                {TARGET_ICONS[target.icon] || <BookOpen className="w-6 h-6" />}
              </div>

              <div className="text-center">
                <span className="font-semibold text-foreground text-sm block">
                  {target.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {target.description}
                </p>
              </div>

              {/* Custom target badge & delete button */}
              {target.isCustom && (
                <>
                  <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-medium">
                    Custom
                  </span>
                  <button
                    onClick={(e) => handleDeleteCustomTarget(e, target.id)}
                    className={cn(
                      "absolute top-2 right-2 p-1 rounded-md",
                      "opacity-0 group-hover:opacity-100",
                      "bg-destructive/10 hover:bg-destructive/20",
                      "text-destructive transition-all duration-200",
                      "cursor-pointer"
                    )}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}

              {/* Hover indicator */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/30 transition-colors pointer-events-none" />
            </motion.button>
          ))}

          {/* Add Custom Target Button */}
          <motion.button
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: allTargets.length * 0.03 }}
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl",
              "bg-card border-2 border-dashed border-border",
              "hover:border-primary/50 hover:bg-accent/30",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "min-h-[120px]"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl",
                "bg-muted/50 group-hover:bg-primary/10",
                "transition-colors duration-200"
              )}
            >
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <span className="font-semibold text-muted-foreground group-hover:text-foreground text-sm transition-colors">
              Add Custom
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Custom Target Modal */}
      <CustomTargetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomTarget}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BookOpen,
  Briefcase,
  Code,
  PenTool,
  Palette,
  Calendar,
  Music,
  Dumbbell,
  Heart,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  Camera,
  Utensils,
  Plane,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Target } from "@/store/target-store";

interface CustomTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: Target) => void;
}

const AVAILABLE_ICONS = [
  { id: "BookOpen", icon: BookOpen, label: "Book" },
  { id: "Briefcase", icon: Briefcase, label: "Work" },
  { id: "Code", icon: Code, label: "Code" },
  { id: "PenTool", icon: PenTool, label: "Writing" },
  { id: "Palette", icon: Palette, label: "Art" },
  { id: "Calendar", icon: Calendar, label: "Planning" },
  { id: "Music", icon: Music, label: "Music" },
  { id: "Dumbbell", icon: Dumbbell, label: "Exercise" },
  { id: "Heart", icon: Heart, label: "Health" },
  { id: "Lightbulb", icon: Lightbulb, label: "Ideas" },
  { id: "Gamepad2", icon: Gamepad2, label: "Gaming" },
  { id: "GraduationCap", icon: GraduationCap, label: "Study" },
  { id: "Camera", icon: Camera, label: "Photo" },
  { id: "Utensils", icon: Utensils, label: "Cooking" },
  { id: "Plane", icon: Plane, label: "Travel" },
];

const AVAILABLE_COLORS = [
  { id: "from-rose-500 to-red-500", name: "Rose", preview: "bg-gradient-to-br from-rose-500 to-red-500" },
  { id: "from-blue-500 to-indigo-500", name: "Blue", preview: "bg-gradient-to-br from-blue-500 to-indigo-500" },
  { id: "from-emerald-500 to-teal-500", name: "Emerald", preview: "bg-gradient-to-br from-emerald-500 to-teal-500" },
  { id: "from-violet-500 to-purple-500", name: "Violet", preview: "bg-gradient-to-br from-violet-500 to-purple-500" },
  { id: "from-amber-500 to-orange-500", name: "Amber", preview: "bg-gradient-to-br from-amber-500 to-orange-500" },
  { id: "from-cyan-500 to-sky-500", name: "Cyan", preview: "bg-gradient-to-br from-cyan-500 to-sky-500" },
  { id: "from-pink-500 to-fuchsia-500", name: "Pink", preview: "bg-gradient-to-br from-pink-500 to-fuchsia-500" },
  { id: "from-lime-500 to-green-500", name: "Lime", preview: "bg-gradient-to-br from-lime-500 to-green-500" },
];

export function CustomTargetModal({ isOpen, onClose, onSave }: CustomTargetModalProps) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("BookOpen");
  const [selectedColor, setSelectedColor] = useState("from-rose-500 to-red-500");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setLabel("");
    setDescription("");
    setSelectedIcon("BookOpen");
    setSelectedColor("from-rose-500 to-red-500");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSave() {
    if (!label.trim()) return;

    setIsSubmitting(true);

    const newTarget: Target = {
      id: `custom-${Date.now()}`,
      label: label.trim(),
      description: description.trim() || "Custom focus target",
      icon: selectedIcon,
      color: selectedColor,
    };

    try {
      await onSave(newTarget);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  const SelectedIconComponent = AVAILABLE_ICONS.find((i) => i.id === selectedIcon)?.icon || BookOpen;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Create Custom Target
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Add a personalized focus target
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Preview */}
          <div className="flex justify-center">
            <motion.div
              layout
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl",
                "bg-card border border-border/50 shadow-lg"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  "bg-gradient-to-br text-white",
                  selectedColor
                )}
              >
                <SelectedIconComponent className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">
                  {label || "Target Name"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {description || "Description"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="target-name" className="text-sm font-medium">
              Target Name
            </Label>
            <Input
              id="target-name"
              type="text"
              placeholder="e.g., Language Learning"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={30}
              className="h-11"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="target-description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Input
              id="target-description"
              type="text"
              placeholder="e.g., Practice Spanish"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
              className="h-11"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              <AnimatePresence>
                {AVAILABLE_ICONS.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  const isSelected = selectedIcon === iconItem.id;

                  return (
                    <motion.button
                      key={iconItem.id}
                      type="button"
                      onClick={() => setSelectedIcon(iconItem.id)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-2 rounded-lg",
                        "border transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-card border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                      {isSelected && (
                        <motion.div
                          layoutId="icon-indicator"
                          className="absolute inset-0 border-2 border-primary rounded-lg"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_COLORS.map((colorItem) => {
                const isSelected = selectedColor === colorItem.id;

                return (
                  <motion.button
                    key={colorItem.id}
                    type="button"
                    onClick={() => setSelectedColor(colorItem.id)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative flex items-center justify-center h-10 rounded-lg",
                      "transition-all duration-200 cursor-pointer",
                      colorItem.preview,
                      isSelected && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!label.trim() || isSubmitting}
              className={cn(
                "bg-gradient-to-r from-violet-500 to-purple-500",
                "hover:from-violet-600 hover:to-purple-600 text-white"
              )}
            >
              {isSubmitting ? "Saving..." : "Create Target"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


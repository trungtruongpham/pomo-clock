"use client";

import { motion } from "framer-motion";
import {
  Info,
  Timer,
  Coffee,
  Target,
  CheckCircle2,
  Brain,
  Clock,
  Zap,
  Heart,
  MessageCircle,
  Send,
  User,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ContactForm } from "@/components/contact/contact-form";

const POMODORO_STEPS = [
  {
    step: 1,
    title: "Choose a Task",
    description: "Select a single task you want to focus on",
    icon: Target,
    color: "from-rose-500 to-red-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500",
  },
  {
    step: 2,
    title: "Set Timer",
    description: "Start a 25-minute focus session",
    icon: Timer,
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-500",
  },
  {
    step: 3,
    title: "Focus Deeply",
    description: "Work until the timer rings",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
  {
    step: 4,
    title: "Take a Break",
    description: "Enjoy a 5-minute refresher",
    icon: Coffee,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
  },
  {
    step: 5,
    title: "Repeat & Rest",
    description: "After 4 pomodoros, take a 15-30 min break",
    icon: CheckCircle2,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
];

const BENEFITS = [
  {
    title: "Improved Focus",
    description:
      "Break your work into manageable chunks to maintain concentration",
    icon: Brain,
    color: "from-rose-500 to-red-500",
  },
  {
    title: "Better Time Awareness",
    description: "Understand how long tasks actually take",
    icon: Clock,
    color: "from-teal-500 to-emerald-500",
  },
  {
    title: "Reduced Burnout",
    description: "Regular breaks prevent mental fatigue",
    icon: Heart,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Increased Productivity",
    description: "Accomplish more with structured work sessions",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
  },
];

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/25 mb-4">
          <Info className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          About PomoClock
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Your productivity companion using the proven Pomodoro Technique
        </p>
      </motion.div>

      {/* What is Pomodoro Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/10">
              <Timer className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              What is the Pomodoro Technique?
            </h2>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            The <strong className="text-foreground">Pomodoro Technique</strong>{" "}
            is a time management method developed by Francesco Cirillo in the
            late 1980s. It uses a timer to break work into focused intervals,
            traditionally 25 minutes in length (called &ldquo;pomodoros&rdquo;),
            separated by short breaks to promote sustained concentration and
            prevent mental fatigue.
          </p>

          {/* Steps */}
          <h3 className="text-lg font-semibold text-foreground mb-4">
            How It Works
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {POMODORO_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="relative group"
                >
                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors duration-200">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3",
                        step.bgColor
                      )}
                    >
                      <Icon className={cn("w-5 h-5", step.textColor)} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          step.bgColor,
                          step.textColor
                        )}
                      >
                        Step {step.step}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Why Use PomoClock?
          </h2>
          <p className="text-muted-foreground">
            Experience the benefits of structured focus sessions
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-200 cursor-default"
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                    `bg-gradient-to-br ${benefit.color}`,
                    "shadow-lg"
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10">
              <MessageCircle className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Contact Us
              </h2>
              <p className="text-sm text-muted-foreground">
                Have questions or feedback? We&apos;d love to hear from you!
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <ContactForm />
          </div>
        </div>
      </motion.section>

      <Toaster />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Home, Timer, Coffee, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-rose-500/20 to-red-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 shadow-xl shadow-rose-500/25 mb-6"
        >
          <Clock className="w-12 h-12 text-white" />
        </motion.div>

        {/* 404 Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4"
        >
          <span className="text-sm font-semibold text-rose-500">Error 404</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-foreground mb-3"
        >
          Time&apos;s Up!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-lg text-muted-foreground mb-8"
        >
          The page you&apos;re looking for has taken a break.
        </motion.p>

        {/* Suggestion Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10">
              <Coffee className="w-5 h-5 text-teal-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              While you&apos;re here...
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Why not take a{" "}
            <span className="font-medium text-foreground">
              productive break
            </span>{" "}
            with our Pomodoro timer? It&apos;s a great way to stay focused and
            manage your time effectively.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/">
            <Button
              className={cn(
                "gap-2 px-6 py-3 h-auto",
                "bg-gradient-to-r from-rose-500 to-red-500",
                "hover:from-rose-600 hover:to-red-600",
                "text-white font-semibold shadow-lg shadow-rose-500/25",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              <Timer className="w-5 h-5" />
              Start a Pomodoro
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 px-6 py-3 h-auto cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <span>Lost? We all need a break sometimes.</span>
      </motion.div>
    </div>
  );
}

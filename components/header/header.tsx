"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createClientSupabase } from "@/lib/supabase-client";
import { signOut } from "@/app/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import {
  LogOut,
  ChartLine,
  Menu,
  Info,
  Trophy,
  Settings,
  Timer,
} from "lucide-react";
import { SettingsModal } from "../settings/settings-modal";
import { cn } from "@/lib/utils";

export default function Header({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Sync with initialUser prop when it changes (e.g., after server-side auth)
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const supabase = createClientSupabase();

    // Only listen for auth state changes, don't call getSession()
    // The server already provided initialUser, so we trust that
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        // Only update on actual auth events, not INITIAL_SESSION
        if (event !== "INITIAL_SESSION") {
          if (process.env.NODE_ENV !== "production") {
            console.log("Auth state changed:", event);
          }
          setUser(session?.user || null);
        }
      }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener("open-settings", handleOpenSettings);
    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-settings", handleOpenSettings);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleLogout() {
    try {
      const result = await signOut();
      if (result.success) {
        setUser(null);
        router.push("/");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  function handleOpenSettings() {
    setIsSettingsOpen(true);
    setMobileMenuOpen(false);
  }

  function handleCloseSettings() {
    setIsSettingsOpen(false);
  }

  const userDisplayName = user?.user_metadata?.name || user?.email;
  const shortUserDisplay = userDisplayName
    ? userDisplayName.length > 16
      ? userDisplayName.substring(0, 13) + "..."
      : userDisplayName
    : "";
  const avatarFallback = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "U";

  const navItems = [
    { href: "/focus-leaders", label: "Leaderboard", icon: Trophy },
  ];

  const NavLink = ({
    href,
    label,
    icon: Icon,
    onClick,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent/50 transition-all duration-200",
        "cursor-pointer"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  const SettingsButton = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={handleOpenSettings}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent/50 transition-all duration-200",
        "cursor-pointer",
        mobile && "w-full"
      )}
    >
      <Settings className="w-4 h-4" />
      <span>Settings</span>
    </button>
  );

  const UserMenu = () => {
    if (!user) {
      return (
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white border-0 shadow-lg shadow-rose-500/25"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full ring-2 ring-border hover:ring-primary/50 transition-all duration-200"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.user_metadata?.avatar_url}
                alt={userDisplayName || "User avatar"}
              />
              <AvatarFallback className="bg-gradient-to-br from-rose-500 to-red-500 text-white font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">
                {shortUserDisplay}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer gap-2"
          >
            <ChartLine className="h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      {/* Floating Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "px-4 sm:px-6 lg:px-8 py-3",
          "transition-all duration-300 ease-out"
        )}
      >
        <div
          className={cn(
            "max-w-5xl mx-auto",
            "flex items-center justify-between",
            "px-4 py-2 rounded-2xl",
            "border border-border/50",
            "transition-all duration-300",
            scrolled
              ? "bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
              : "bg-background/60 backdrop-blur-md"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow duration-200">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              PomoClock
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            ))}
            <SettingsButton />
            <NavLink href="/about" label="About" icon={Info} />

            <div className="w-px h-6 bg-border mx-2" />

            <UserMenu />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <UserMenu />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-500">
                      <Timer className="w-4 h-4 text-white" />
                    </div>
                    PomoClock
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                  <SettingsButton mobile />
                  <NavLink
                    href="/about"
                    label="About"
                    icon={Info}
                    onClick={() => setMobileMenuOpen(false)}
                  />

                  {user && (
                    <>
                      <div className="h-px bg-border my-4" />

                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                          "text-muted-foreground hover:text-foreground",
                          "hover:bg-accent/50 transition-all duration-200",
                          "cursor-pointer"
                        )}
                      >
                        <ChartLine className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                          "text-destructive hover:text-destructive",
                          "hover:bg-destructive/10 transition-all duration-200",
                          "cursor-pointer"
                        )}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[72px] sm:h-[76px]" />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </>
  );
}

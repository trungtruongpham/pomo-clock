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
import { Button } from "../ui/button";
import { LogOut, ChartLine } from "lucide-react";
import { SettingsModal } from "../settings/settings-modal";

export default function Header({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientSupabase();

    // Initial check for session
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setUser(session?.user || null);
      setIsLoading(false);

      if (process.env.NODE_ENV !== "production") {
        console.log("Initial session check:", {
          hasSession: !!session,
          user: session?.user,
        });
      }
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (process.env.NODE_ENV !== "production") {
          console.log("Auth state changed:", event, {
            hasSession: !!session,
            user: session?.user,
          });
        }

        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Handle scroll events for header transparency effect
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Listen for custom events
    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener("open-settings", handleOpenSettings);
    window.addEventListener("scroll", handleScroll);

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-settings", handleOpenSettings);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialUser]);

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
  }

  function handleCloseSettings() {
    setIsSettingsOpen(false);
  }

  // Get user display name (use name if available, otherwise email)
  const userDisplayName = user?.user_metadata?.name || user?.email;
  // Shorten email if needed for display
  const shortUserDisplay = userDisplayName
    ? userDisplayName.length > 16
      ? userDisplayName.substring(0, 13) + "..."
      : userDisplayName
    : "";

  // Get first letter of name/email for avatar fallback
  const avatarFallback = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      <header
        className={`py-4 border-b fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold">PomoClock</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="transition-colors"
                >
                  <Link href="/focus-leaders">Leaders</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenSettings}
                  className="transition-colors"
                >
                  Settings
                </Button>
              </li>
              {isLoading ? (
                <li>
                  <span className="">Loading...</span>
                </li>
              ) : user ? (
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.user_metadata?.avatar_url}
                            alt={userDisplayName || ""}
                          />
                          <AvatarFallback>{avatarFallback}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
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
                        className="cursor-pointer"
                      >
                        <ChartLine className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ) : (
                <li>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Add spacing div to prevent content from being hidden behind fixed header */}
      <div className="h-[60px] sm:h-[64px]"></div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </>
  );
}

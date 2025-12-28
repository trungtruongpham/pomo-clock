"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { createClientSupabase } from "@/lib/supabase-client";

interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce: string;
            use_fedcm_for_prompt?: boolean;
            itp_support?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (
            callback?: (notification: PromptMomentNotification) => void
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const OneTapComponent = () => {
  const supabase = createClientSupabase();
  const [isInitialized, setIsInitialized] = useState(false);

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    let isSubscribed = true;

    const initializeGoogleOneTap = async () => {
      // Prevent double initialization
      if (isInitialized) return;

      // Wait for google script to load
      if (!window.google?.accounts?.id) {
        return;
      }

      try {
        const [nonce, hashedNonce] = await generateNonce();

        // Use onAuthStateChange to check session instead of getSession
        // This avoids unnecessary cookie writes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "INITIAL_SESSION" && !session && isSubscribed) {
            // No session exists, initialize One Tap
            try {
              window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
                callback: async (response: CredentialResponse) => {
                  try {
                    const { error } = await supabase.auth.signInWithIdToken({
                      provider: "google",
                      token: response.credential,
                      nonce,
                    });

                    if (error) throw error;

                    // Redirect after successful login
                    window.location.href = "/";
                  } catch (error) {
                    console.error(
                      "Error logging in with Google One Tap",
                      error
                    );
                  }
                },
                nonce: hashedNonce,
                // Disable FedCM to avoid browser compatibility issues
                use_fedcm_for_prompt: false,
                // Enable ITP support for Safari
                itp_support: true,
                cancel_on_tap_outside: false,
              });

              setIsInitialized(true);

              // Prompt with error handling
              window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                  const reason = notification.getNotDisplayedReason();
                  // Silently handle common reasons (user opted out, browser blocked, etc.)
                  if (reason !== "opt_out_or_no_session") {
                    console.log("One Tap not displayed:", reason);
                  }
                }
                if (notification.isDismissedMoment()) {
                  console.log(
                    "One Tap dismissed:",
                    notification.getDismissedReason()
                  );
                }
              });
            } catch (initError) {
              console.log("Failed to initialize Google One Tap:", initError);
            }
          }
          // Unsubscribe after initial check
          subscription.unsubscribe();
        });
      } catch (error) {
        console.log("Google One Tap setup error:", error);
      }
    };

    // Use a small delay to ensure the Google script is loaded
    const timeoutId = setTimeout(initializeGoogleOneTap, 500);

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      // Cancel One Tap if component unmounts
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.cancel();
        } catch {
          // Ignore cancel errors
        }
      }
    };
  }, [supabase.auth, isInitialized]);

  return (
    <Script 
      src="https://accounts.google.com/gsi/client" 
      strategy="lazyOnload"
    />
  );
};

export default OneTapComponent;

"use client";

import Script from "next/script";
import { useEffect } from "react";
import { createClientSupabase } from "@/lib/supabase-client";

interface CredentialResponse {
  credential: string;
  select_by: string;
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
            use_fedcm_for_prompt: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const OneTapComponent = () => {
  const supabase = createClientSupabase();

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
      console.log("Initializing Google One Tap");

      // Wait for google script to load
      if (!window.google?.accounts?.id) {
        return;
      }

      const [nonce, hashedNonce] = await generateNonce();

      // Use onAuthStateChange to check session instead of getSession
      // This avoids unnecessary cookie writes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION" && !session && isSubscribed) {
          // No session exists, initialize One Tap
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
                console.error("Error logging in with Google One Tap", error);
              }
            },
            nonce: hashedNonce,
            use_fedcm_for_prompt: true,
          });
          window.google.accounts.id.prompt();
        }
        // Unsubscribe after initial check
        subscription.unsubscribe();
      });
    };

    // Use a small delay to ensure the Google script is loaded
    const timeoutId = setTimeout(initializeGoogleOneTap, 500);

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
    };
  }, [supabase.auth]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;

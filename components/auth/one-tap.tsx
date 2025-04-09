"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    const initializeGoogleOneTap = () => {
      console.log("Initializing Google One Tap");
      window.addEventListener("load", async () => {
        const [nonce, hashedNonce] = await generateNonce();
        console.log("Nonce: ", nonce, hashedNonce);

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session", error);
          return;
        }
        if (data.session) {
          // Don't show One Tap if user is already logged in
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;

              // Let the parent component handle navigation
              // The auth state change will trigger the appropriate redirect
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
            }
          },
          nonce: hashedNonce,
          // with chrome's removal of third-party cookies, we need to use FedCM instead
          use_fedcm_for_prompt: true,
        });
        window.google.accounts.id.prompt(); // Display the One Tap UI
      });
    };
    initializeGoogleOneTap();
    return () => window.removeEventListener("load", initializeGoogleOneTap);
  }, [router, supabase.auth]);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;

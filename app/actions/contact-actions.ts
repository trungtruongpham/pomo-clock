"use server";

import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase-server";
import { createSafeAction } from "@/lib/create-safe-action";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const sendContactMessage = createSafeAction(
  contactSchema,
  async ({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) => {
    const supabase = await createServerSupabase();

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      return {
        success: true,
        message: "Your message has been sent successfully!",
      };
    } catch (error) {
      console.error("Error sending contact message:", error);
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }
  }
);

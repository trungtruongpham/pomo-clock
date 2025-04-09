import { PomodoroExplanation } from "@/components/explanation-card";
import { ContactForm } from "@/components/contact/contact-form";
import { Toaster } from "@/components/ui/sonner";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About PomoClock</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            What is the Pomodoro Technique?
          </h2>
          <PomodoroExplanation />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-6 text-muted-foreground">
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
          <ContactForm />
        </div>
      </div>

      <Toaster />
    </div>
  );
}

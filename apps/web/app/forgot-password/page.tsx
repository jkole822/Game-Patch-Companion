import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
    >
      <div className="page-margins pt-10 sm:pt-20">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}

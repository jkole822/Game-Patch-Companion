import { AuthForm } from "@/components";

import { registerAction } from "./actions";

export default async function RegisterPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
    >
      <div className="page-margins pt-10 sm:pt-20">
        <AuthForm action={registerAction} title="Register" variant="register" />
      </div>
    </main>
  );
}

import { AuthForm } from "@/components";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-landing-background.png)" }}
    >
      <div className="page-margins pt-10 sm:pt-20">
        <AuthForm
          action="/api/auth/register"
          error={error ?? null}
          title="Register"
          variant="register"
        />
      </div>
    </main>
  );
}

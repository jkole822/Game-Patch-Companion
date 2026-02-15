"use client";

import { useState } from "react";

import type { FormEvent } from "react";

export default function Home() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const text = await response.text();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
            body: text ? JSON.parse(text) : null,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setResult(
        JSON.stringify(
          { error: error instanceof Error ? error.message : "Unknown error" },
          null,
          2,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Auth Route Tester</h1>
      <p className="text-sm opacity-80">Testing: POST /api/auth/register</p>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded border px-3 py-2"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="rounded border px-3 py-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          minLength={8}
          required
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Request"}
        </button>
      </form>

      <pre className="overflow-auto rounded border p-3 text-xs whitespace-pre-wrap">
        {result || "Response will appear here."}
      </pre>
    </main>
  );
}

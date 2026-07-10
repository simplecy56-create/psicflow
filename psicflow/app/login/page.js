"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert({
          user_id: data.user.id,
          name: name || email,
        });
      }
      if (!data.session) {
        setInfo("Conta criada! Verifique seu e-mail para confirmar antes de entrar.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center mx-auto mb-3">
            <Stethoscope size={22} className="text-white" />
          </div>
          <p className="font-semibold text-lg text-gray-900">PsicFlow</p>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "signin" ? "Entre para acessar seu sistema" : "Crie sua conta"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
        >
          {mode === "signup" && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dra. Marina Silva"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 block mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {info && <p className="text-xs text-green-600">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "signin" ? (
            <>
              Ainda não tem conta?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setInfo("");
                }}
                className="text-brand font-medium"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setInfo("");
                }}
                className="text-brand font-medium"
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

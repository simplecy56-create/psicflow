"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setStatus("ok");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    );
  }

  return children;
}

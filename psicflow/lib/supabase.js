import { createBrowserClient } from "@supabase/ssr";

// As chaves abaixo são públicas por design (a "publishable key" do Supabase
// é segura para expor no navegador - a segurança real vem das políticas RLS
// configuradas no banco de dados).
const supabaseUrl = "https://rnpajyrhcxslbuenxvfq.supabase.co";
const supabaseKey = "sb_publishable_soV6-8Zwzq_44EJSUax6gA_KnuT0cBI";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

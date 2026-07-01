# PsicFlow

Sistema para psicólogos, no visual do sistema de referência (Hero Systems), sem o módulo de mensagens.

## O que já está pronto neste pacote

- Estrutura geral do projeto (Next.js + Tailwind)
- Menu lateral com todos os módulos
- **Dashboard** funcional (mostra dados reais de pacientes)
- **Pacientes** funcional (cadastrar, listar, ver detalhes, remover)
- Páginas dos outros módulos como "em construção" (para não dar erro ao clicar no menu)

Os dados de pacientes são salvos no navegador (localStorage) por enquanto. Isso será
trocado por um banco de dados de verdade (Supabase) quando o projeto avançar.

## Como rodar localmente

1. Extraia esta pasta em `C:\Users\Cayk\Documents\psicflow` (ou onde preferir)
2. Abra essa pasta no VS Code
3. No terminal do VS Code, rode:

```
npm install
npm run dev
```

4. Abra `http://localhost:3000` no navegador

## Próximos pacotes

Cada módulo (Agenda, Prontuários, Financeiro, Relatórios, Tarefas, Recursos,
Configurações) será entregue em um pacote separado, sempre atualizando este mesmo
projeto — é só pedir qual módulo construir em seguida.

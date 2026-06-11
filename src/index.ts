#!/usr/bin/env node
import * as p from "@clack/prompts";
import chalk from "chalk";
import { runGenerator } from "./generator.js";
import { validateProjectName } from "./utils.js";

const BANNER = `
${chalk.blue("  ██████╗ ██████╗  █████╗ ███████╗██╗██╗     ")}
${chalk.blue("  ██╔══██╗██╔══██╗██╔══██╗╚══███╔╝██║██║     ")}
${chalk.blue("  ██████╔╝██████╔╝███████║  ███╔╝ ██║██║     ")}
${chalk.blue("  ██╔══██╗██╔══██╗██╔══██║ ███╔╝  ██║██║     ")}
${chalk.blue("  ██████╔╝██║  ██║██║  ██║███████╗██║███████╗")}
${chalk.blue("  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝")}
${chalk.dim("  create-brazilian-app  v1.0.0")}
${chalk.dim("  baseado em Next.js Brazilian Starter · Guto-Edu")}
`;

async function main() {
  console.log(BANNER);

  p.intro(chalk.bgBlue(chalk.white(" Vamos criar seu projeto ")));

  // Nome do projeto: pode vir como argumento ou pelo prompt
  const argName = process.argv[2];

  const answers = await p.group(
    {
      projectName: () => {
        if (argName) {
          const err = validateProjectName(argName);
          if (err) {
            p.log.error(err);
            process.exit(1);
          }
          p.log.info(`Nome do projeto: ${chalk.cyan(argName)}`);
          return Promise.resolve(argName);
        }
        return p.text({
          message: "Nome do projeto",
          placeholder: "meu-projeto",
          validate: validateProjectName,
        });
      },

      packageManager: () =>
        p.select({
          message: "Gerenciador de pacotes",
          options: [
            { value: "npm", label: "npm" },
            { value: "pnpm", label: "pnpm", hint: "recomendado" },
            { value: "yarn", label: "yarn" },
          ],
          initialValue: "pnpm",
        }),

      database: () =>
        p.select({
          message: "Banco de dados",
          options: [
            {
              value: "supabase",
              label: "Supabase",
              hint: "Postgres gerenciado + Auth + Storage",
            },
            {
              value: "local",
              label: "Banco local",
              hint: "Prisma, Drizzle, SQLite...",
            },
            {
              value: "none",
              label: "Nenhum agora",
              hint: "Configuro depois",
            },
          ],
          initialValue: "supabase",
        }),

      initGit: () =>
        p.confirm({
          message: "Inicializar repositório git?",
          initialValue: true,
        }),

      installDeps: () =>
        p.confirm({
          message: "Instalar dependências agora?",
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operação cancelada.");
        process.exit(0);
      },
    }
  );

  await runGenerator(answers as {
    projectName: string;
    packageManager: "npm" | "pnpm" | "yarn";
    database: "supabase" | "local" | "none";
    initGit: boolean;
    installDeps: boolean;
  });
}

main().catch((err) => {
  console.error(chalk.red("\nErro inesperado:"), err.message);
  process.exit(1);
});

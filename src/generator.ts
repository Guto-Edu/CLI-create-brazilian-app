import * as p from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";
import { setupDatabase, setupEnv } from "./setup.js";
import { getInstallCommand, sleep } from "./utils.js";

const STARTER_REPO = "Guto-Edu/Next.js_Brazilian_Starter";

interface GeneratorOptions {
  projectName: string;
  packageManager: "npm" | "pnpm" | "yarn";
  database: "supabase" | "local" | "none";
  initGit: boolean;
  installDeps: boolean;
}

export async function runGenerator(opts: GeneratorOptions) {
  const { projectName, packageManager, database, initGit, installDeps } = opts;
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log("");

  // 1. Verificar se pasta já existe
  if (await fs.pathExists(targetDir)) {
    const overwrite = await p.confirm({
      message: `A pasta ${chalk.cyan(projectName)} já existe. Sobrescrever?`,
      initialValue: false,
    });
    if (!overwrite) {
      p.cancel("Operação cancelada.");
      process.exit(0);
    }
    await fs.remove(targetDir);
  }

  // 2. Clonar o starter
  const cloneSpinner = ora({
    text: `Clonando ${chalk.cyan("Next.js Brazilian Starter")}...`,
    color: "blue",
  }).start();

  try {
    const { default: tiged } = await import("tiged");
    const emitter = tiged(STARTER_REPO, {
      cache: false,
      force: true,
      verbose: false,
    });
    await emitter.clone(targetDir);
    cloneSpinner.succeed(chalk.green("Starter clonado com sucesso"));
  } catch {
    cloneSpinner.fail("Erro ao clonar o starter");
    p.log.error(
      "Verifique sua conexão com a internet e tente novamente."
    );
    process.exit(1);
  }

  // 3. Atualizar package.json com nome do projeto
  const pkgSpinner = ora("Configurando package.json...").start();
  try {
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    pkg.version = "0.1.0";
    delete pkg.description;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    pkgSpinner.succeed(chalk.green("package.json configurado"));
  } catch {
    pkgSpinner.fail("Erro ao configurar package.json");
  }

  // 4. Configurar .env
  const envSpinner = ora("Configurando variáveis de ambiente...").start();
  try {
    await setupEnv(targetDir, projectName, database);
    envSpinner.succeed(chalk.green(".env.local criado"));
  } catch {
    envSpinner.fail("Erro ao criar .env.local");
  }

  // 5. Configurar banco de dados
  if (database !== "none") {
    const dbSpinner = ora(`Configurando ${database}...`).start();
    try {
      await setupDatabase(targetDir, database);
      dbSpinner.succeed(chalk.green(`Configuração de ${database} aplicada`));
    } catch {
      dbSpinner.fail(`Erro ao configurar ${database}`);
    }
  }

  // 6. Remover lockfiles desnecessários
  const cleanSpinner = ora("Limpando arquivos desnecessários...").start();
  try {
    const filesToClean = [
      ".git",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lockb",
    ];
    // Manter apenas o lockfile do gerenciador escolhido não é necessário agora
    // Apenas remove o .git para dar git init limpo
    await fs.remove(path.join(targetDir, ".git"));
    cleanSpinner.succeed(chalk.green("Arquivos limpos"));
  } catch {
    cleanSpinner.fail("Erro ao limpar arquivos");
  }

  // 7. Git init
  if (initGit) {
    const gitSpinner = ora("Inicializando repositório git...").start();
    try {
      await execa("git", ["init"], { cwd: targetDir });
      await execa("git", ["add", "-A"], { cwd: targetDir });
      await execa(
        "git",
        ["commit", "-m", "chore: initial commit from create-brazilian-app"],
        { cwd: targetDir }
      );
      gitSpinner.succeed(chalk.green("Git inicializado com commit inicial"));
    } catch {
      gitSpinner.fail("Erro ao inicializar git (git instalado?)");
    }
  }

  // 8. Instalar dependências
  if (installDeps) {
    const installCmd = getInstallCommand(packageManager);
    const installSpinner = ora(
      `Instalando dependências com ${chalk.cyan(packageManager)}...`
    ).start();
    try {
      await execa(installCmd.cmd, installCmd.args, {
        cwd: targetDir,
        stdio: "pipe",
      });
      installSpinner.succeed(chalk.green("Dependências instaladas"));
    } catch {
      installSpinner.fail(
        `Erro ao instalar dependências. Rode ${chalk.cyan(`${packageManager} install`)} manualmente.`
      );
    }
  }

  // 9. Mensagem final
  await sleep(300);
  console.log("");
  p.outro(chalk.green("Projeto criado com sucesso!"));

  console.log(`
${chalk.bold("Para começar:")}

  ${chalk.cyan(`cd ${projectName}`)}
  ${!installDeps ? chalk.cyan(`${packageManager} install\n  `) : ""}${chalk.cyan(`${packageManager} run dev`)}

${chalk.dim(`Acesse: http://localhost:3000`)}

${chalk.dim("─────────────────────────────────────")}
${chalk.dim("Documentação do starter:")}
${chalk.dim(`  ${targetDir}/START.md`)}
${chalk.dim("─────────────────────────────────────")}
`);
}

import fs from "fs-extra";
import path from "path";

export async function setupEnv(
  targetDir: string,
  projectName: string,
  database: "supabase" | "local" | "none"
) {
  const examplePath = path.join(targetDir, ".env.example");
  const envPath = path.join(targetDir, ".env.local");

  let envContent = "";

  if (await fs.pathExists(examplePath)) {
    envContent = await fs.readFile(examplePath, "utf-8");
  } else {
    // Fallback se o .env.example não existir
    envContent = `# Gerado por create-brazilian-app
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="${projectName}"
`;
  }

  // Substituir nome do app
  envContent = envContent
    .replace(
      /NEXT_PUBLIC_APP_NAME=.*/,
      `NEXT_PUBLIC_APP_NAME="${projectName}"`
    )
    .replace(
      /NEXT_PUBLIC_APP_URL=.*/,
      `NEXT_PUBLIC_APP_URL=http://localhost:3000`
    );

  // Adicionar bloco do banco escolhido, se não estiver no exemplo
  if (database === "supabase" && !envContent.includes("SUPABASE")) {
    envContent += `
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
`;
  }

  if (database === "local" && !envContent.includes("DATABASE_URL")) {
    envContent += `
# Banco local
DATABASE_URL=
`;
  }

  await fs.writeFile(envPath, envContent, "utf-8");
}

export async function setupDatabase(
  targetDir: string,
  database: "supabase" | "local"
) {
  const dbDir = path.join(targetDir, "src", "lib", "database");

  if (database === "supabase") {
    const clientExample = path.join(dbDir, "supabase", "client.js.example");
    const serverExample = path.join(dbDir, "supabase", "server.js.example");
    const clientDest = path.join(dbDir, "supabase", "client.js");
    const serverDest = path.join(dbDir, "supabase", "server.js");

    if (await fs.pathExists(clientExample)) {
      await fs.copy(clientExample, clientDest);
    }
    if (await fs.pathExists(serverExample)) {
      await fs.copy(serverExample, serverDest);
    }
  }

  if (database === "local") {
    const clientExample = path.join(dbDir, "local", "client.js.example");
    const clientDest = path.join(dbDir, "local", "client.js");

    if (await fs.pathExists(clientExample)) {
      await fs.copy(clientExample, clientDest);
    }
  }
}

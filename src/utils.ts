export function validateProjectName(name: string): string | undefined {
  if (!name || name.trim().length === 0) {
    return "O nome do projeto é obrigatório";
  }
  if (!/^[a-z0-9-_]+$/.test(name)) {
    return "Use apenas letras minúsculas, números, hífens ou underscores";
  }
  if (name.startsWith("-") || name.startsWith("_")) {
    return "O nome não pode começar com hífen ou underscore";
  }
  if (name.length > 64) {
    return "O nome deve ter no máximo 64 caracteres";
  }
  return undefined;
}

export function getInstallCommand(pm: "npm" | "pnpm" | "yarn"): {
  cmd: string;
  args: string[];
} {
  switch (pm) {
    case "pnpm":
      return { cmd: "pnpm", args: ["install"] };
    case "yarn":
      return { cmd: "yarn", args: [] };
    case "npm":
    default:
      return { cmd: "npm", args: ["install"] };
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

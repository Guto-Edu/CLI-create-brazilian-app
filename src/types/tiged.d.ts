declare module "tiged" {
  type TigedOptions = {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: "tar" | "git";
    disableCache?: boolean;
    auth?: string;
  };

  type TigedEmitter = {
    on(event: "info" | "warn" | "error", callback: (message: string) => void): TigedEmitter;
    clone(destination: string): Promise<void>;
  };

  export default function tiged(
    source: string,
    options?: TigedOptions
  ): TigedEmitter;
}
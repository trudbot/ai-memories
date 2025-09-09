import { isBrowser } from "./main-check";

// 检测是否为 Node 环境并读取 .env.local
export async function loadEnvFromFile() {
  if (isBrowser()) return {};

  try {
    const { readFileSync } = await import("fs");
    const { resolve, dirname } = await import("path");
    const { fileURLToPath } = await import("url");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = resolve(__dirname, "../../.env.local");
    const envContent = readFileSync(envPath, "utf-8");

    const env = {};
    envContent.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join("=");
        }
      }
    });
    return env;
  } catch (err) {
    console.warn("无法读取 .env.local 文件:", err.message);
    return {};
  }
}
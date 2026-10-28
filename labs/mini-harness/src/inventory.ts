// The tool's logic, kept apart from the SDK so it can be tested without calling the API.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type Service = { name: string; status: string; version: string; note?: string };

// Fixed path: the tool takes a service name, never a file path, so the model can't point it elsewhere.
export const DATA_FILE = fileURLToPath(new URL("../data/services.json", import.meta.url));

export function lookupService(name: string, file = DATA_FILE): Service | undefined {
  const services = JSON.parse(readFileSync(file, "utf8")) as Service[];
  return services.find((service) => service.name === name);
}

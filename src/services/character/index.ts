import { create } from "axios";
import { ICharacter } from "@/types";

const http = create({
  baseURL: "https://hp-api.onrender.com/api",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

const houses = new Set([
  "Gryffindor",
  "Hufflepuff",
  "Ravenclaw",
  "Slytherin",
  "",
]);

export function isCharacter(value: unknown): value is ICharacter {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    c.id.length > 0 &&
    typeof c.name === "string" &&
    typeof c.house === "string" &&
    houses.has(c.house) &&
    (c.dateOfBirth === null || typeof c.dateOfBirth === "string") &&
    typeof c.patronus === "string" &&
    typeof c.actor === "string" &&
    typeof c.image === "string"
  );
}

const fetchAll = async (): Promise<ICharacter[]> => {
  const { data } = await http.get<unknown>("/characters");
  if (!Array.isArray(data)) throw new Error("Invalid character response");
  const characters = data
    .filter(isCharacter)
    .map((character) => ({ ...character, attempts: 0, isGuessed: false }));
  if (!characters.length) throw new Error("No characters available");
  return characters;
};

export const characterService = { fetchAll };

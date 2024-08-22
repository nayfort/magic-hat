import axios from "axios";
import { ICharacter, TCharacterId } from "@/types";
import { HARRY_POTTER } from "@/constants";

const http = axios.create({
  baseURL: "https://hp-api.onrender.com/api",
  timeout: 2000,
  headers: { Accept: "application/json", "Content-type": "application/json" },
});

const fetchAll = async () => {
  let characters: ICharacter[] = [];

  try {
    const res = await http.get<ICharacter[]>("/characters");
    characters = res.data;
  } catch (error) { /* */ }

  return characters;
};

const fetchById = async (id: TCharacterId): Promise<ICharacter> => {
  let character: ICharacter = HARRY_POTTER;

  try {
    const res = await http.get<ICharacter[]>(`/character/${id}`);
    character = res.data[0];
  } catch (error) { /* */ }

  return character;
};

export const characterService = { fetchAll, fetchById };

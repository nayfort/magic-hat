import { ICharacter } from "@/types";

export const DEFAULT_CHARACTER_IMAGE = require("@/assets/images/default.png");

// default character
export const HARRY_POTTER: ICharacter = {
  id: "9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8",
  name: "Harry Potter",
  house: "Gryffindor",
  dateOfBirth: "31-07-1980",
  patronus: "stag",
  actor: "Daniel Radcliffe",
  image: "https://ik.imagekit.io/hpapi/harry.jpg",
  attempts: 0,
  isGuessed: false,
};

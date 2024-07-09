import { CharityType } from "./charityType";
import { Temple } from "./temple";

export interface Entry {
    id: number;
    title: string;
    name: string;
    temple: Temple;
    charityType: CharityType;
    createdOn: string;
  }
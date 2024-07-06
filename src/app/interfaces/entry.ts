import { Temple, TempleService } from "./temple";

export interface Entry {
    id: number;
    title: string;
    name: string;
    temple: Temple;
    templeService: TempleService;
  }
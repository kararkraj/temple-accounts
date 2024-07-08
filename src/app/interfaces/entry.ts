import { Temple } from "./temple";
import { TempleService } from "./templeService";

export interface Entry {
    id: number;
    title: string;
    name: string;
    temple: Temple;
    templeService: TempleService;
  }
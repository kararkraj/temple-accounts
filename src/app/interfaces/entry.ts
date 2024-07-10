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

export interface EntryReq {
  title: string;
  name: string;
  createdOn: string;

  templeName: string;
  templeAddress: string;
  templeId: string;

  charityTypeName: string;
  charityTypeAmount: number;
  charityTypeId: string;
}
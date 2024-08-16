export interface Entry extends EntryRequest {
  id: string;
}

export interface EntryRequest extends EntryAdd {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface EntryAdd {
  title: string;
  name: string;

  templeName: string;
  templeAddress: string;
  templeId: string;

  charityTypeName: string;
  charityTypeAmount: number;
  charityTypeId: string;
}
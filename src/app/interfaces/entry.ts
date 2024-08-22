export interface Entry extends EntryAdd {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryResponse extends EntryAdd {
  createdAt: { seconds: number, nanoseconds: number};
  createdBy: string;
  updatedAt: { seconds: number, nanoseconds: number};
}

export interface EntryRequest extends EntryAdd {
  createdAt: any;
  createdBy: string;
  updatedAt: any;
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
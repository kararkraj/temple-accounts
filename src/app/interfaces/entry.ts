export interface Entry extends EntryRequest {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntryForList extends Entry {
  templeName: string;
  templeAddress: string;
}

export interface EntryRequest extends EntryAdd {
  createdAt: any;
  createdBy: string;
  updatedAt: any;
  isActive: boolean;
}

export interface EntryAdd {
  title: string;
  name: string;
  serviceName: string;
  serviceAmount: number;
  serviceId: string;
}
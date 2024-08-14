export interface Temple extends TempleRequest {
    id: string;
}

export interface TempleRequest {
    name: string;
    address: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
}
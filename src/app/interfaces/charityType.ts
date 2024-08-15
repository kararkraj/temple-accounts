export interface CharityType extends CharityTypeRequest {
    id: string;
}

export interface CharityTypeRequest {
    name: string;
    amount: number;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
}
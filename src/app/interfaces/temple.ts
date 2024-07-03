export interface Temple {
    id: number;
    templeName: string;
    templeAddress: string;
    services: TempleService[]
}

export interface TempleService {
    id: number;
    serviceName: string;
    amount: number;
}
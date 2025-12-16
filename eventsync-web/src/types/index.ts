export type Role = 'USER' | 'ORGANIZER';
export type EventType = 'FREE' | 'PAID';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'INSCRIPTIONS_OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    city?: string;
    photo_url?: string;
}

export interface Event {
    id: string;
    organizer_id: string;
    title: string;
    description: string;
    start_date: string; // ISO date string
    end_date: string;   // ISO date string
    location_address?: string;
    location_url?: string;
    price: number;
    type: EventType;
    status: EventStatus;
    max_inscriptions?: number;
    banner_url?: string;
    organizer?: User; // Optional if joined
}

export interface AuthResponse {
    user: User;
    token: string;
}

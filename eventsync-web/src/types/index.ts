export type Role = 'USER' | 'ORGANIZER';
export type EventType = 'FREE' | 'PAID';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'INSCRIPTIONS_OPEN' | 'ONGOING' | 'FINISHED' | 'CANCELED';
export type RegistrationStatus = 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED' | 'CANCELED' | 'CONFIRMED';
export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    city?: string;
    photo_url?: string;
    visibility_participation?: boolean;
}

export interface Event {
    id: string;
    organizer_id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location_address?: string;
    location_url?: string;
    price: number;
    type: EventType;
    status: EventStatus;
    max_inscriptions?: number;
    banner_url?: string;
    organizer?: User;
    registrations?: Registration[];
    isRegistered?: boolean;
    registrationStatus?: RegistrationStatus;
}

export interface Registration {
    id: string;
    event_id: string;
    event?: Event;
    user_id: string;
    user?: User;
    status: RegistrationStatus;
    created_at: string;
}

export interface Friendship {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: FriendshipStatus;
}

export interface AuthResponse {
    user: User;
    token: string;
}

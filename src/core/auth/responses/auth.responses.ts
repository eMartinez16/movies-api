import { User } from "../../../user/entities/user.entity";

export interface RegisterResponse {
    message: string;
}

export interface LoginResponse {
    user: Partial<User>;
    token: string;
}
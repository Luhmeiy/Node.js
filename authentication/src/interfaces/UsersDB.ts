import { Roles } from "./Roles";

export interface UsersDB {
	users: {
		username: string;
		roles: Roles;
		password: string;
		refreshToken: string;
	}[];
	setUsers: (data: any) => void;
}

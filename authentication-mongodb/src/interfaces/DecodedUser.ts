import { Roles } from "./Roles";

export interface DecodedUser {
	UserInfo: {
		username: string;
		roles: Roles;
	};
}

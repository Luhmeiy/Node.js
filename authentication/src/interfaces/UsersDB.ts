export interface UsersDB {
	users: {
		username: string;
		password: string;
		refreshToken: string;
	}[];
	setUsers: (data: any) => void;
}

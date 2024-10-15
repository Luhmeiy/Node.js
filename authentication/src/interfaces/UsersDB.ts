export interface UsersDB {
	users: {
		username: string;
		roles: {
			[key: string]: number | undefined;
		};
		password: string;
		refreshToken: string;
	}[];
	setUsers: (data: any) => void;
}

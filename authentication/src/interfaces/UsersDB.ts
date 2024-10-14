export interface UsersDB {
	users: {
		username: string;
		password: string;
	}[];
	setUsers: (data: any) => void;
}

export type Project = {
	id: string;
	title: string;
	statuses: Array<{
		order: number;
		id: string;
		color: string;
		title: string;
	}>;
};

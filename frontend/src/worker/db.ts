import { Table, createDB, createTable } from 'blinkdb';
import { Project } from './models/project';
import { Task } from './models/task';

export type TableModel<T> = T extends Table<infer M, any> ? M : never;
export type TablePk<T> = T extends Table<any, infer Pk> ? Pk : never;

export const createDatabase = () => {
	const db = createDB();

	const dbSchema = {
		project_table: createTable<Project>(db, 'project_table')({ primary: 'id' }),
		task_table: createTable<Task>(db, 'task_table')({ primary: 'id', indexes: ['statusId'] }),
	} as const;
	return dbSchema;
};

export type Database = ReturnType<typeof createDatabase>;

export const db = createDatabase();

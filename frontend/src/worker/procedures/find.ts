import { Query, Table, many } from 'blinkdb';
import { Database, TableModel, TablePk, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface FindProcedure<T extends keyof Database> extends Procedure {
	name: 'find';
	payload: { table: T; query: Query<TableModel<Database[T]>, TablePk<Database[T]>> };
	responseValue: Array<TableModel<Database[T]>>;
	responseType: 'promise';
}

export const findProcedureHandler: ProcedureHandler<FindProcedure<keyof Database>> = {
	name: 'find',
	responseType: 'promise',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		return many(table, payload.query);
	},
};

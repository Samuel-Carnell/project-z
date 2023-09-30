import { Table, insert } from 'blinkdb';
import { Database, TableModel, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface InsertProcedure<T extends keyof Database = keyof Database> extends Procedure {
	name: 'insert';
	payload: { table: T; value: TableModel<Database[T]> };
	responseValue: void;
	responseType: 'promise';
}

export const insertProcedureHandler: ProcedureHandler<InsertProcedure<keyof Database>> = {
	name: 'insert',
	responseType: 'promise',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		return insert(table, payload.value).then(() => undefined);
	},
};

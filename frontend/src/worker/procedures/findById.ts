import { Table, one } from 'blinkdb';
import { Database, TableModel, TablePk, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface FindByIdProcedure<T extends keyof Database = keyof Database> extends Procedure {
	name: 'findById';
	payload: { table: T; id: TableModel<Database[T]>[TablePk<Database[T]>] };
	responseValue: TableModel<Database[T]> | null;
	responseType: 'promise';
}

export const findByIdProcedureHandler: ProcedureHandler<FindByIdProcedure<keyof Database>> = {
	name: 'findById',
	responseType: 'promise',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		return one(table, payload.id);
	},
};

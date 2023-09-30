import { Table, remove } from 'blinkdb';
import { Database, TableModel, TablePk, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface RemoveByIdProcedure<T extends keyof Database = keyof Database> extends Procedure {
	name: 'removeById';
	payload: { table: T; id: TableModel<Database[T]>[TablePk<Database[T]>] };
	responseValue: void;
	responseType: 'promise';
}

export const removeByIdProcedureHandler: ProcedureHandler<RemoveByIdProcedure<keyof Database>> = {
	name: 'removeById',
	responseType: 'promise',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		return remove(table, { id: payload.id }).then(() => undefined);
	},
};

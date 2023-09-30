import { Table, update } from 'blinkdb';
import { Database, TableModel, TablePk, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface UpdateByIdProcedure<T extends keyof Database = keyof Database> extends Procedure {
	name: 'updateById';
	payload: {
		table: T;
		id: TableModel<Database[T]>[TablePk<Database[T]>];
		diff: Partial<TableModel<Database[T]>>;
	};
	responseValue: void;
	responseType: 'promise';
}

export const updateByIdProcedureHandler: ProcedureHandler<UpdateByIdProcedure<keyof Database>> = {
	name: 'updateById',
	responseType: 'promise',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		console.log('handler', payload);
		return update(table, { ...payload.diff, id: payload.id }).then(() => undefined);
	},
};

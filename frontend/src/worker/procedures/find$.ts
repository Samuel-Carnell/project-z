import { Query, Table, watch } from 'blinkdb';
import { Observable } from 'rxjs';
import { Database, TableModel, TablePk, db } from '../db';
import { Procedure, ProcedureHandler } from '../types';

export interface WatchProcedure<T extends keyof Database = keyof Database> extends Procedure {
	name: 'watch';
	payload: { table: T; query: Query<TableModel<Database[T]>, TablePk<Database[T]>> };
	responseValue: Array<TableModel<Database[T]>>;
	responseType: 'observable';
}

export const watchProcedureHandler: ProcedureHandler<WatchProcedure<keyof Database>> = {
	name: 'watch',
	responseType: 'observable',
	handlerFn: (payload) => {
		const table = db[payload.table] as Table<any, any>;
		const a = performance.now();
		return new Observable<WatchProcedure<keyof Database>['responseValue']>((observer) => {
			watch(table, payload.query, (x) => {
				const b = performance.now();
				console.log('actual time took ' + (b - a) + 'ms');
				observer.next(x);
			});
		});
	},
};

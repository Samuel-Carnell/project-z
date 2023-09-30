import { Observable, filter, share, take } from 'rxjs';
import { v4 as uuid } from 'uuid';
import type { WatchProcedure } from './procedures/find$';
import type { FindByIdProcedure } from './procedures/findById';
import type { InsertProcedure } from './procedures/insert';
import type { RemoveByIdProcedure } from './procedures/removeById';
import type { UpdateByIdProcedure } from './procedures/updateById';
import type { IncomingMessage, Procedure, ProcedureResponse } from './types';
import Worker from './worker?worker';

const worker = new Worker();

const postMessage = (message: IncomingMessage) => {
	console.log(message);
	worker.postMessage(message);
};

const workerMessages$ = new Observable<ProcedureResponse>((observer) => {
	worker.onmessage = (message) => {
		console.log(message.data);
		observer.next(message.data);
	};
}).pipe(share());

function callProcedure<T extends Procedure>(
	procedureName: T['name'],
	responseType: T['responseType'],
	payload: T['payload'],
): T['responseType'] extends 'observable' ? Observable<T['responseValue']> : Promise<T['responseValue']> {
	if (responseType === 'observable') {
		return new Observable((observer) => {
			const procedureCallId = uuid();
			const message: IncomingMessage = {
				action: 'call-procedure',
				procedureName,
				procedureCallId,
				payload,
			};

			postMessage(message);
			const subscription = workerMessages$
				.pipe(filter((message) => message.procedureCallId === procedureCallId))
				.subscribe({
					next: (message) => {
						if (message.status === 'data') {
							observer.next(message.data);
						}

						if (message.status === 'error') {
							observer.error(message.error);
						}

						if (message.status === 'complete') {
							observer.complete();
						}
					},
				});

			return () => {
				subscription.unsubscribe();
				const message: IncomingMessage = {
					action: 'unsubscribe-from-procedure-call',
					procedureCallId,
				};
				postMessage(message);
			};
		}) as any;
	}

	return new Promise((resolve, reject) => {
		const procedureCallId = uuid();
		const message: IncomingMessage = {
			action: 'call-procedure',
			procedureName,
			procedureCallId,
			payload,
		};

		postMessage(message);
		workerMessages$
			.pipe(
				filter((message) => message.procedureCallId === procedureCallId),
				take(1),
			)
			.subscribe({
				next: (message) => {
					if (message.status === 'resolved') {
						resolve(message.data as T['responseValue']);
					} else if (message.status === 'error') {
						reject(message.error);
					}
				},
			});
	}) as any;
}

export const workerInterface = {
	watch: (payload: WatchProcedure['payload']) => callProcedure<WatchProcedure>('watch', 'observable', payload),
	findById: (payload: FindByIdProcedure['payload']) => callProcedure<FindByIdProcedure>('findById', 'promise', payload),
	insert: (payload: InsertProcedure['payload']) => callProcedure<InsertProcedure>('insert', 'promise', payload),
	removeById: (payload: RemoveByIdProcedure['payload']) =>
		callProcedure<RemoveByIdProcedure>('removeById', 'promise', payload),
	updateById: (payload: UpdateByIdProcedure['payload']) =>
		callProcedure<UpdateByIdProcedure>('updateById', 'promise', payload),
};

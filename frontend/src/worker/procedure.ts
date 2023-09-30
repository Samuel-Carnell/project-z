import { Observable, Subscription, finalize } from 'rxjs';
import { watchProcedureHandler } from './procedures/find$';
import { findByIdProcedureHandler } from './procedures/findById';
import { insertProcedureHandler } from './procedures/insert';
import { removeByIdProcedureHandler } from './procedures/removeById';
import { updateByIdProcedureHandler } from './procedures/updateById';
import { Procedure, ProcedureCall, ProcedureHandler, ProcedureResponse } from './types';

const handlers = [
	findByIdProcedureHandler,
	watchProcedureHandler,
	updateByIdProcedureHandler,
	removeByIdProcedureHandler,
	insertProcedureHandler,
] as Array<ProcedureHandler<Procedure>>;

const subscriptions = new Map<string, Subscription>();

export function callProcedure<T extends Procedure>(
	procedureCall: ProcedureCall<T>,
	sendResponse: (response: ProcedureResponse) => void,
) {
	const procedureHandler = handlers.find((handler) => handler.name === procedureCall.procedureName);
	if (procedureHandler === undefined) {
		return;
	}

	if (procedureHandler?.responseType === 'immediate') {
		try {
			const response = procedureHandler.handlerFn(procedureCall.payload);
			sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'resolved', data: response });
		} catch (error) {
			sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'error', error });
		}
		return;
	}

	if (procedureHandler?.responseType === 'promise') {
		(procedureHandler.handlerFn(procedureCall.payload) as Promise<unknown>)
			.then((data) => {
				sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'resolved', data: data });
			})
			.catch((error) => {
				sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'error', error });
			});
		return;
	}

	if (procedureHandler?.responseType === 'observable') {
		const subscription = (procedureHandler.handlerFn(procedureCall.payload) as Observable<unknown>)
			.pipe(finalize(() => subscriptions.delete(procedureCall.procedureCallId)))
			.subscribe({
				next: (data) => sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'data', data }),
				complete: () => sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'complete' }),
				error: (error) => sendResponse({ procedureCallId: procedureCall.procedureCallId, status: 'error', error }),
			});

		subscriptions.set(procedureCall.procedureCallId, subscription);
	}
}

export function unsubscribeFromProcedureCall(payload: { procedureCallId: string }) {
	subscriptions.delete(payload.procedureCallId);
}

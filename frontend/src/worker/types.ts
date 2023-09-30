import { Observable } from 'rxjs';

export type Procedure = {
	name: string;
	responseType: 'immediate' | 'promise' | 'observable';
	payload: any;
	responseValue: any;
};

export type ProcedureHandler<T extends Procedure> = {
	name: T['name'];
	responseType: T['responseType'];
	handlerFn: (
		payload: T['payload'],
	) => T['responseType'] extends 'immediate'
		? T['responseType']
		: T['responseType'] extends 'promise'
			? Promise<T['responseValue']>
			: T['responseType'] extends 'observable'
				? Observable<T['responseValue']>
				: T['responseValue'] | Promise<T['responseValue']> | Observable<T['responseValue']>;
};

export type ProcedureResponse<T extends Procedure = Procedure> =
	| {
			procedureCallId: string;
			status: 'error';
			error: unknown;
			data?: undefined;
	  }
	| { procedureCallId: string; status: 'resolved'; error?: undefined; data: T['responseValue'] }
	| { procedureCallId: string; status: 'data'; error?: undefined; data: T['responseValue'] }
	| { procedureCallId: string; status: 'complete'; error?: undefined; data?: undefined };

export type ProcedureCall<T extends Procedure = Procedure> = {
	procedureCallId: string;
	procedureName: T['name'];
	payload: T['payload'];
};

export type IncomingMessage =
	| ({ action: 'call-procedure' } & ProcedureCall)
	| { action: 'unsubscribe-from-procedure-call'; procedureCallId: string };

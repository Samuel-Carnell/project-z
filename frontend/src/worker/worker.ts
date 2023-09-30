/// <reference lib="WebWorker" />

import { db } from './db';
import { callProcedure, unsubscribeFromProcedureCall } from './procedure';
import { seed } from './seed';
import { IncomingMessage } from './types';

seed(db).then(() => {
	addEventListener('message', (event: MessageEvent<IncomingMessage>) => {
		const message = event.data;
		if (message.action === 'call-procedure') {
			callProcedure(message, postMessage);
			return;
		}

		if (message.action === 'unsubscribe-from-procedure-call') {
			unsubscribeFromProcedureCall(message);
			return;
		}
	});
});

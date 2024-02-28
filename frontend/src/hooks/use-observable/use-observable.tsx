import { useCallback, useRef, useSyncExternalStore } from 'react';
import { Observable } from 'rxjs';

export function useObservableValue<T>($: Observable<T>, _default: T) {
	const valueRef = useRef(_default);
	const subscribe = useCallback(
		(update: () => void) => {
			const subscription = $.subscribe({
				next: (_value) => {
					valueRef.current = _value;
					update();
				},
			});
			return () => subscription.unsubscribe();
		},
		[$],
	);
	return useSyncExternalStore(
		subscribe,
		useCallback(() => valueRef.current, []),
	);
}

import { uuid } from 'blinkdb';
import { useCallback, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Observable, Subject, map, scan, shareReplay, startWith, switchMap, tap } from 'rxjs';

function usePersistent<T>(getValue: () => T) {
	return useState(getValue)[0];
}

class UndoRedoStack {
	private _undoStack: Array<() => () => void> = [];
	private _redoStack: Array<() => () => void> = [];

	public undo() {
		const fn = this._undoStack.pop();
		if (fn === undefined) {
			return;
		}

		const redoFn = fn();
		this._redoStack.push(() => {
			redoFn();
			return fn;
		});
		console.log(this);
	}

	public redo() {
		const fn = this._redoStack.pop();
		if (fn === undefined) {
			return;
		}

		const redoFn = fn();
		this._undoStack.push(() => {
			redoFn();
			return fn;
		});
	}

	public addUndoFn(undoFn: () => () => void) {
		this._redoStack.length = 0;
		this._undoStack.push(undoFn);
	}
}

function useInteractive<Value, Action>(
	sourceValue$: Observable<Value>,
	reducer: (value: Value, action: Action) => Value,
	_default: Value,
) {
	const undoRedoStack = usePersistent(() => new UndoRedoStack());
	const action$ = usePersistent(() => new Subject<Action & { id: string }>());
	const allActions$ = usePersistent(() =>
		action$.pipe(
			scan(
				(actions, action) => {
					return [...actions, action];
				},
				[] as Array<Action & { id: string }>,
			),
			startWith([] as Array<Action & { id: string }>),
		),
	);

	const revertedAction$ = usePersistent(() => new Subject<string>());
	const revertedActions$ = usePersistent(() =>
		revertedAction$.pipe(
			scan((revertedActions, revertedAction) => [...revertedActions, revertedAction], [] as string[]),
			startWith([] as string[]),
			shareReplay(1),
		),
	);

	useHotkeys('ctrl+z', () => undoRedoStack.undo(), [undoRedoStack]);
	useHotkeys('ctrl+shift+z', () => undoRedoStack.redo(), [undoRedoStack]);

	const applicableActions$ = usePersistent(() =>
		allActions$.pipe(
			switchMap((actions) => {
				return revertedActions$.pipe(
					map((revertedActions) => {
						return actions.filter((action) => !revertedActions.includes(action.id));
					}),
				);
			}),
			shareReplay(1),
		),
	);

	const displayableValue$ = usePersistent(() =>
		sourceValue$.pipe(
			startWith(_default),
			switchMap((trueValue) => {
				return applicableActions$.pipe(
					tap((x) => console.log(x)),
					map((actions) => actions.map((action) => action).reduce(reducer, trueValue)),
				);
			}),
		),
	);

	return [
		displayableValue$,
		useCallback(
			(action: Action, undoAction: Action) => {
				const actionId = uuid();
				action$.next({ ...action, id: actionId });
				undoRedoStack.addUndoFn(() => {
					action$.next({ id: uuid(), ...undoAction });
					return () => {
						action$.next({ id: uuid(), ...action });
					};
				});
				return () => revertedAction$.next(actionId);
			},
			[action$, revertedAction$, undoRedoStack],
		),
	] as const;
}

export { useInteractive };

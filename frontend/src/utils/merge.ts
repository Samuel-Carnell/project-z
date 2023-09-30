export class Timestamped<T> {
	public static from<T>(value: T, timestamp?: number) {
		return new Timestamped(value, timestamp ?? Date.now());
	}

	private constructor(
		public readonly value: T,
		public readonly timestamp: number,
	) {}
}

export function applyListDelta<T>(
	source: Timestamped<Array<T>>,
	delta: Timestamped<{ type: 'remove' | 'insert'; value: T }>,
) {
	if (delta.timestamp < source.timestamp) {
		return source;
	}

	if (delta.value.type === 'insert') {
		return { value: [...source.value, delta], timestamp: delta.timestamp };
	}

	if (delta.value.type === 'remove') {
		return { value: source.value.filter((x) => x !== delta.value), timestamp: delta.timestamp };
	}
}

export function applyObjectDelta<T extends Record<string, any>>(source: T, delta: Partial<Omit<T, 'id'>>) {
	const newObj = { ...source };
	for (const key in delta) {
		if (source[key].timestamp < delta[key]!.timestamp) {
			//@ts-ignore
			newObj[key] = delta[key];
		}
	}
	return newObj;
}

import { useState } from 'react';

export function usePersistent<T>(getValue: () => T) {
	return useState(getValue)[0];
}

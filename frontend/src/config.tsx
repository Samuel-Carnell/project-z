import { ReactNode, createContext, useContext } from 'react';
import { suspend } from 'suspend-react';

type Config = { [key: string]: any };

const configContext = createContext<Config | null>(null);

export const RuntimeConfig = ({ children }: { children: ReactNode }) => {
	const config = suspend(() => fetch('/config.json').then((data) => data.json()), []);
	return <configContext.Provider value={config}>{children}</configContext.Provider>;
};

export const useConfig = () => {
	const config = useContext(configContext);
	if (config === null) {
		throw new Error('No value provided for configContext');
	}

	return config;
};

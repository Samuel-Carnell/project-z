import { theme, extendTheme } from '@chakra-ui/react';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

const customTheme = extendTheme(theme, {
	styles: {
		global: {
			'*': {
				outline: 'none !important',
			},
		},
	},
	fonts: {
		heading: `"Inter"`,
		body: `"Inter"`,
	},
});

export { customTheme as theme };

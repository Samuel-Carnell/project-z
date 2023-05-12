import { Preview } from "@storybook/react";
import React, { StrictMode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../src/theme";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	}
};

export const decorators = [
	Story => (
		<StrictMode>
			<Story />
		</StrictMode>
	),
	Story => <ChakraProvider theme={theme}>{Story()}</ChakraProvider>,
	Story => <></>
];

export default preview;

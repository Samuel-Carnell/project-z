import type { Preview } from "@storybook/react";
import React, { StrictMode } from "react";

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
	)
];

export default preview;

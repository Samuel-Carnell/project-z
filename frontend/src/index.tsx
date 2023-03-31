import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

function main(): void {
	const rootElement: HTMLElement | null = document.getElementById("root");

	if (rootElement === null) {
		throw new Error('Unable to create React root. No element found with id "root".');
	}

	const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	const Wrapper = isDevMode ? StrictMode : Fragment;

	createRoot(rootElement).render(
		<Wrapper>
			<App />
		</Wrapper>
	);
}

main();

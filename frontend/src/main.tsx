import App from 'App';
import { RuntimeConfig } from 'config';
import { EventSourceProvider } from 'eventsource';
import { createRoot } from 'react-dom/client';
import './index.css';

function main() {
	const rootElement = document.getElementById('root');
	if (rootElement === null) {
		throw new Error('Root element does not exist. Root element must have id of "root"');
	}

	const root = createRoot(rootElement);
	root.render(
		<RuntimeConfig>
			<EventSourceProvider>
				<App />
			</EventSourceProvider>
		</RuntimeConfig>,
	);
}

main();

import {
	Plate,
	PlateContent,
	PlatePlugin,
	createAutoformatPlugin,
	createExitBreakPlugin,
	createPlugins,
	createResetNodePlugin,
} from '@udecode/plate';
import { ComponentProps, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';
import { FloatingToolbar } from './Toolbar';
import {
	baseExtension,
	codeExtension,
	containerContext,
	headingExtension,
	listExtension,
	textFormattingExtension,
} from './extensions';
import { Extension } from './types';

function compileExtensions(...extensions: Extension[]) {
	const editorConfig = extensions.reduce<Required<Extension>>(
		(previous: Required<Extension>, cur: Extension): Required<Extension> => {
			return {
				plugins: [...previous.plugins, ...(cur.plugins ?? [])],
				components: { ...previous.components, ...(cur.components ?? {}) },
				autoFormatRules: [...previous.autoFormatRules, ...(cur.autoFormatRules ?? [])],
				exitBreakRules: [...previous.exitBreakRules, ...(cur.exitBreakRules ?? [])],
				resetNodeRules: [...previous.resetNodeRules, ...(cur.resetNodeRules ?? [])],
			};
		},
		{
			autoFormatRules: [],
			components: {},
			exitBreakRules: [],
			plugins: [],
			resetNodeRules: [],
		},
	);

	const plugins: PlatePlugin[] = [
		...editorConfig.plugins,
		createAutoformatPlugin({
			options: {
				rules: editorConfig.autoFormatRules,
			},
		}),
		createExitBreakPlugin({
			options: {
				rules: editorConfig.exitBreakRules,
			},
		}),
		createResetNodePlugin({
			options: { rules: editorConfig.resetNodeRules },
		}),
	];

	return createPlugins(plugins, { components: editorConfig.components });
}

const plugins = compileExtensions(
	baseExtension,
	textFormattingExtension,
	headingExtension,
	codeExtension,
	listExtension,
);

export const Editor = ({
	container,
	className,
	value,
	onChange,
	...props
}: Omit<ComponentProps<typeof PlateContent>, 'value' | 'onChange'> & { container?: RefObject<HTMLElement> } & Pick<
		ComponentProps<typeof Plate>,
		'value' | 'onChange'
	>) => {
	return (
		<containerContext.Provider value={container ?? { current: null }}>
			<Plate plugins={plugins} value={value} onChange={onChange}>
				<PlateContent className={twMerge('text-[#3c4149] focus-visible:outline-none', className)} {...props} />
				<FloatingToolbar />
			</Plate>
		</containerContext.Provider>
	);
};

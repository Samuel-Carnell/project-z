import { IconBold, IconCode, IconItalic, IconUnderline } from '@tabler/icons-react';
import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_UNDERLINE } from '@udecode/plate-basic-marks';
import { useMarkToolbarButton, useMarkToolbarButtonState } from '@udecode/plate-common';
import { offset, shift, useFloatingToolbar, useFloatingToolbarState } from '@udecode/plate-floating';
import { ReactNode, useContext } from 'react';
import { containerContext } from './extensions';

function ToolbarButton({ nodeType, children }: { nodeType: string; children?: ReactNode }) {
	const state = useMarkToolbarButtonState({ nodeType });
	const { props: buttonProps } = useMarkToolbarButton(state);

	return (
		<button {...buttonProps} className="rounded-md p-1 hover:bg-[#E6E6E6]">
			{children}
		</button>
	);
}

export const FloatingToolbar = () => {
	const container = useContext(containerContext);
	const floatingToolbarState = useFloatingToolbarState({
		floatingOptions: {
			placement: 'top',
			middleware: [offset(6), shift({ boundary: container.current ?? undefined, padding: -36 })],
		},
	});

	const { ref: floatingRef, props: rootProps, hidden } = useFloatingToolbar(floatingToolbarState);

	if (hidden) return null;

	return (
		<div
			ref={floatingRef}
			{...rootProps}
			className="flex gap-1 rounded-md border border-[#dfe1e4] bg-white bg-opacity-80 px-1 py-1 shadow-sm [backdrop-filter:blur(12px)_saturate(100%)_contrast(50%)_brightness(130%)]"
		>
			<ToolbarButton nodeType={MARK_BOLD}>
				<IconBold size={20} />
			</ToolbarButton>
			<ToolbarButton nodeType={MARK_ITALIC}>
				<IconItalic size={20} />
			</ToolbarButton>
			<ToolbarButton nodeType={MARK_UNDERLINE}>
				<IconUnderline size={20} />
			</ToolbarButton>
			<ToolbarButton nodeType={MARK_CODE}>
				<IconCode size={20} />
			</ToolbarButton>
		</div>
	);
};

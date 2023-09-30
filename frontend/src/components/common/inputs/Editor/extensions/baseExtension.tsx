import { PlateElement } from '@udecode/plate-common';
import { ELEMENT_LI } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH, createParagraphPlugin } from '@udecode/plate-paragraph';
import { twMerge } from 'tailwind-merge';
import { Extension } from '../types';

export const baseExtension: Extension = {
	plugins: [createParagraphPlugin()],
	components: {
		[ELEMENT_PARAGRAPH]: ({ className, ...props }) => (
			<PlateElement as="p" className={twMerge(className, 'text-[14px] mb-1 selection:bg-[#a6c0f1]')} {...props} />
		),
	},
	exitBreakRules: [
		{
			hotkey: 'mod+enter',
			query: {
				exclude: [ELEMENT_LI],
			},
		},
		{
			hotkey: 'mod+shift+enter',
			before: true,
		},
	],
};

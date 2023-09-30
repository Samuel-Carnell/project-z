import { PlateElement } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, createHeadingPlugin } from '@udecode/plate-heading';
import { Extension } from '../types';

export const headingExtension: Extension = {
	plugins: [createHeadingPlugin()],
	autoFormatRules: [
		{
			mode: 'block',
			type: ELEMENT_H1,
			match: '# ',
		},
		{
			mode: 'block',
			type: ELEMENT_H2,
			match: '## ',
		},
		{
			mode: 'block',
			type: ELEMENT_H3,
			match: '### ',
		},
		{
			mode: 'block',
			type: ELEMENT_H4,
			match: '#### ',
		},
	],
	exitBreakRules: [
		{
			hotkey: 'enter',
			query: {
				start: true,
				end: true,
				allow: [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4],
			},
			relative: true,
			level: 1,
		},
	],
	components: {
		[ELEMENT_H1]: (props) => (
			<PlateElement {...props} as="h3" className="mb-2 mt-6 text-[21px] font-medium selection:bg-[#a6c0f1]" />
		),
		[ELEMENT_H2]: (props) => (
			<PlateElement {...props} as="h4" className="mb-2 mt-6 text-[17px] font-semibold selection:bg-[#a6c0f1]" />
		),
		[ELEMENT_H3]: (props) => (
			<PlateElement {...props} as="h5" className="mb-1 mt-4 text-[15px] font-semibold selection:bg-[#a6c0f1]" />
		),
		[ELEMENT_H4]: (props) => (
			<PlateElement {...props} as="h6" className="mb-0.5 mt-4 text-[13px] font-bold selection:bg-[#a6c0f1]" />
		),
	},
};

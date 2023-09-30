import {
	MARK_BOLD,
	MARK_ITALIC,
	MARK_STRIKETHROUGH,
	MARK_SUBSCRIPT,
	MARK_SUPERSCRIPT,
	MARK_UNDERLINE,
	createBoldPlugin,
	createItalicPlugin,
	createStrikethroughPlugin,
	createSubscriptPlugin,
	createSuperscriptPlugin,
	createUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { PlateLeaf } from '@udecode/plate-common';
import { Extension } from '../types';

export const textFormattingExtension: Extension = {
	plugins: [
		createBoldPlugin(),
		createUnderlinePlugin(),
		createStrikethroughPlugin(),
		createItalicPlugin(),
		createSuperscriptPlugin(),
		createSubscriptPlugin(),
	],
	autoFormatRules: [
		{
			mode: 'mark',
			type: [MARK_BOLD, MARK_ITALIC],
			match: '***',
		},
		{
			mode: 'mark',
			type: [MARK_UNDERLINE, MARK_ITALIC],
			match: '__*',
		},
		{
			mode: 'mark',
			type: [MARK_UNDERLINE, MARK_BOLD],
			match: '__**',
		},
		{
			mode: 'mark',
			type: [MARK_UNDERLINE, MARK_BOLD, MARK_ITALIC],
			match: '___***',
		},
		{
			mode: 'mark',
			type: MARK_BOLD,
			match: '**',
		},
		{
			mode: 'mark',
			type: MARK_UNDERLINE,
			match: '__',
		},
		{
			mode: 'mark',
			type: MARK_ITALIC,
			match: '*',
		},
		{
			mode: 'mark',
			type: MARK_ITALIC,
			match: '_',
		},
		{
			mode: 'mark',
			type: MARK_STRIKETHROUGH,
			match: '~~',
		},
		{
			mode: 'mark',
			type: MARK_SUPERSCRIPT,
			match: '^',
		},
		{
			mode: 'mark',
			type: MARK_SUBSCRIPT,
			match: '~',
		},
	],
	components: {
		[MARK_BOLD]: (props) => <PlateLeaf {...props} as="strong" className="font-semibold" />,
		[MARK_UNDERLINE]: (props) => <PlateLeaf {...props} className="underline" />,
		[MARK_STRIKETHROUGH]: (props) => <PlateLeaf {...props} className="font-semibold" />,
		[MARK_ITALIC]: (props) => <PlateLeaf {...props} as="em" className="italic" />,
		[MARK_SUPERSCRIPT]: (props) => <PlateLeaf {...props} as="sup" />,
		[MARK_SUBSCRIPT]: (props) => <PlateLeaf {...props} as="sub" />,
	},
};

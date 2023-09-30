import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL, createListPlugin, toggleList, unwrapList } from '@udecode/plate';
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@udecode/plate-code-block';
import { PlateEditor, PlateElement, PlateElementProps, getParentNode, isElement, isType } from '@udecode/plate-common';
import { twMerge } from 'tailwind-merge';
import { Extension } from '../types';

const preFormat = (editor: PlateEditor) => unwrapList(editor);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const format = (editor: PlateEditor, customFormatting: any) => {
	if (editor.selection) {
		const parentEntry = getParentNode(editor, editor.selection);
		if (!parentEntry) return;
		const [node] = parentEntry;
		if (isElement(node) && !isType(editor, node, ELEMENT_CODE_BLOCK) && !isType(editor, node, ELEMENT_CODE_LINE)) {
			customFormatting();
		}
	}
};

const formatList = (editor: PlateEditor, elementType: string) => {
	format(editor, () =>
		toggleList(editor, {
			type: elementType,
		}),
	);
};

export const listExtension: Extension = {
	plugins: [
		createListPlugin({
			overrideByKey: {
				[ELEMENT_UL]: {
					options: {
						enableResetOnShiftTab: true,
					},
				},
			},
		}),
	],
	autoFormatRules: [
		{
			mode: 'block',
			type: ELEMENT_LI,
			match: ['* ', '- '],
			preFormat,
			format: (editor) => formatList(editor, ELEMENT_UL),
		},
		{
			mode: 'block',
			type: ELEMENT_LI,
			match: ['1. ', '1) '],
			preFormat,
			format: (editor) => formatList(editor, ELEMENT_OL),
		},
	],
	components: {
		[ELEMENT_UL]: ({ className, children, ...props }: PlateElementProps) => (
			<PlateElement
				as="ul"
				className={twMerge(
					'mb-2 mt-1 list-disc ps-8 selection:bg-[#a6c0f1] [&_ul]:my-0 [&_ul]:list-[circle] [&_ul_ul]:list-[square]',
					className,
				)}
				{...props}
			>
				{children}
			</PlateElement>
		),
		[ELEMENT_OL]: ({ className, children, ...props }: PlateElementProps) => (
			<PlateElement
				as="ol"
				className={twMerge('mb-2 mt-1 list-decimal ps-8 selection:bg-[#a6c0f1]', className)}
				{...props}
			>
				{children}
			</PlateElement>
		),
		[ELEMENT_LI]: ({ className, ...props }) => (
			<PlateElement {...props} className={twMerge(className, 'text-[14px] marker:text-[14px]')} as="li" />
		),
	},
};

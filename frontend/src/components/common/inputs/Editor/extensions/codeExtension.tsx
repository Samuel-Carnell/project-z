import {
	ELEMENT_CODE_BLOCK,
	ELEMENT_CODE_LINE,
	ELEMENT_CODE_SYNTAX,
	ELEMENT_PARAGRAPH,
	MARK_CODE,
	TCodeBlockElement,
	createCodeBlockPlugin,
	createCodePlugin,
	insertEmptyCodeBlock,
	isCodeBlockEmpty,
	isSelectionAtCodeBlockStart,
	unwrapCodeBlock,
	useCodeBlockCombobox,
	useCodeBlockComboboxState,
	useCodeBlockElementState,
	useCodeSyntaxLeaf,
} from '@udecode/plate';
import {
	ELEMENT_DEFAULT,
	PlateElement,
	PlateElementProps,
	PlateLeaf,
	PlateLeafProps,
	Value,
} from '@udecode/plate-common';
import { RefObject, createContext, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Extension } from '../types';
import LanguageSyntaxSelect from './select';

export const containerContext = createContext<RefObject<HTMLElement>>({ current: null });

export const codeExtension: Extension = {
	plugins: [createCodeBlockPlugin(), createCodePlugin()],
	autoFormatRules: [
		{
			mode: 'block',
			type: ELEMENT_CODE_BLOCK,
			match: '```',
			triggerAtBlockStart: false,
			format: (editor) => {
				insertEmptyCodeBlock(editor, {
					defaultType: ELEMENT_DEFAULT,
					insertNodesOptions: { select: true },
				});
			},
		},
		{
			mode: 'mark',
			type: MARK_CODE,
			match: '`',
		},
	],
	resetNodeRules: [
		{
			types: [ELEMENT_CODE_BLOCK],
			defaultType: ELEMENT_PARAGRAPH,
			onReset: unwrapCodeBlock,
			hotkey: 'Enter',
			predicate: isCodeBlockEmpty,
		},
		{
			types: [ELEMENT_CODE_BLOCK],
			defaultType: ELEMENT_PARAGRAPH,
			onReset: unwrapCodeBlock,
			hotkey: 'Backspace',
			predicate: isSelectionAtCodeBlockStart,
		},
	],
	components: {
		[ELEMENT_CODE_BLOCK]: forwardRef<HTMLDivElement, PlateElementProps<Value, TCodeBlockElement>>(
			({ className, ...props }, ref) => {
				const { children, element } = props;
				const { className: codeBlockClassName } = useCodeBlockElementState({
					element: element,
				});

				const state = useCodeBlockComboboxState();
				const { commandItemProps } = useCodeBlockCombobox(state);

				return (
					<PlateElement
						ref={ref}
						className={twMerge(
							codeBlockClassName,
							className,
							'relative mb-2 rounded-md bg-[#F4F4F4] px-3 py-2 text-[12px] leading-snug selection:bg-[#a6c0f1]',
						)}
						{...props}
					>
						<div className="absolute right-1.5 top-2" contentEditable={false}>
							<LanguageSyntaxSelect
								selected={state.value}
								onSelect={(value) => {
									commandItemProps.onSelect(value);
								}}
							/>
						</div>
						<pre>
							<code>{children}</code>
						</pre>
					</PlateElement>
				);
			},
		),
		[ELEMENT_CODE_LINE]: PlateElement,
		[ELEMENT_CODE_SYNTAX]: ({ children, leaf, ...props }: PlateLeafProps) => {
			const { tokenProps } = useCodeSyntaxLeaf({ leaf });

			return (
				<PlateLeaf leaf={leaf} {...props}>
					<span {...tokenProps}>{children}</span>
				</PlateLeaf>
			);
		},
		[MARK_CODE]: ({ children, ...props }: PlateLeafProps) => {
			return (
				<PlateLeaf
					{...props}
					className="rounded-[2px] bg-[#F4F4F4] px-[5px] py-[1px] align-text-top font-mono text-[12px]"
					as="code"
				>
					{children}
				</PlateLeaf>
			);
		},
	},
};

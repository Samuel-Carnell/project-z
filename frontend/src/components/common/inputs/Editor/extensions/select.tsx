import { autoUpdate, limitShift, offset, shift, useFloating } from '@floating-ui/react';
import { Listbox } from '@headlessui/react';
import { IconSelector } from '@tabler/icons-react';
import { CODE_BLOCK_LANGUAGES, CODE_BLOCK_LANGUAGES_POPULAR } from '@udecode/plate-code-block';
import { useEditorState } from '@udecode/plate-common';
import { useMemo } from 'react';

const languages: { value: string; label: string }[] = [
	{ value: 'text', label: 'Plain Text' },
	...Object.entries({
		...CODE_BLOCK_LANGUAGES_POPULAR,
		...CODE_BLOCK_LANGUAGES,
	}).map(([key, val]) => ({
		value: key,
		label: val as string,
	})),
];

export default function LanguageSyntaxSelect({
	selected: selectedValue,
	onSelect,
}: {
	selected: string;
	onSelect: (language: string) => void;
}) {
	const selected = useMemo(() => languages.find((language) => language.value === selectedValue), [selectedValue]);
	const { refs, floatingStyles } = useFloating({
		placement: 'left',
		whileElementsMounted: autoUpdate,
		middleware: [shift({ padding: 12, limiter: limitShift() }), offset(8)],
	});
	const { deselect } = useEditorState();

	return (
		<Listbox value={selected?.value} onChange={onSelect}>
			<div className="relative">
				<Listbox.Button
					onClick={deselect}
					ref={refs.setReference}
					className="flex h-3 cursor-pointer items-center text-[11px] font-semibold"
				>
					<span>{selected?.label}</span>
					<IconSelector strokeWidth={2} width={16} height={16} className="ml-1" />
				</Listbox.Button>
				<Listbox.Options
					ref={refs.setFloating}
					style={floatingStyles}
					className="z-20 max-h-80 w-56 overflow-auto rounded-md  border border-[#dfe1e4] bg-white bg-opacity-80 py-1 text-[12px] shadow-md [backdrop-filter:blur(12px)_saturate(100%)_contrast(50%)_brightness(130%)]  [scrollbar-width:thin] focus:outline-none"
				>
					{languages.map((language) => (
						<Listbox.Option
							key={language.value}
							className={({ active }) =>
								`relative cursor-pointer select-none px-3 py-1 ${
									active ? 'bg-black bg-opacity-5 text-gray-900' : 'text-gray-900'
								}`
							}
							value={language.value}
						>
							{({ selected }) => (
								<span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{language.label}</span>
							)}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</div>
		</Listbox>
	);
}

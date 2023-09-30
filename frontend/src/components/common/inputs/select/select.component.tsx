import { offset, useFloating } from '@floating-ui/react';
import { Combobox } from '@headlessui/react';
import { IconCheck, IconPointFilled, IconSearch } from '@tabler/icons-react';
import { ReactElement, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Option = {
	label: string;
	value: string;
};

type SelectProps<T extends Option> = {
	onChange?: (value: T['value']) => void;
	value: T['value'];
	options: readonly T[];
	className?: string;
	children?: (props: { open: boolean; option: T }) => ReactElement;
};

function Select<T extends Option = Option>({ options, value, children, className, onChange }: SelectProps<T>) {
	const [searchValue, setSearchValue] = useState('');
	const { refs, floatingStyles } = useFloating({
		placement: 'left-start',
		strategy: 'absolute',
		middleware: [offset({ mainAxis: 8, crossAxis: -16 })],
	});

	return (
		<Combobox value={value} onChange={onChange}>
			<div className={twMerge('relative', className)}>
				<Combobox.Button
					ref={refs.setReference}
					className="flex h-3 cursor-pointer items-center text-[11px] font-semibold "
					onClick={() => setSearchValue('')}
				>
					{({ open, value }) => children?.({ open, option: options.find((x) => x.value === value)! }) ?? <></>}
				</Combobox.Button>
				<Combobox.Options
					className={`shadow-lg-rg w-46 z-20 my-1 max-h-80 w-48 overflow-auto whitespace-nowrap rounded border border-[#dfe1e4] bg-white bg-opacity-50 p-1.5 py-2 text-[12px] text-xs shadow-md [backdrop-filter:blur(12px)_saturate(190%)_contrast(50%)_brightness(130%)] [scrollbar-width:thin]  focus:outline-none`}
					ref={refs.setFloating}
					style={floatingStyles}
				>
					<div className="flex w-full items-center justify-start rounded border border-[#dfe1e4] bg-white bg-opacity-10 px-2 ">
						<IconSearch className="h-3.5 w-3.5" />
						{/* <Search className="text-custom-text-300 h-3.5 w-3.5" /> */}
						<Combobox.Input
							className="text-custom-text-200 placeholder:text-custom-text-400 w-full bg-transparent px-2 py-1 text-xs focus:outline-none"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							placeholder="Search"
						/>
					</div>
					<div className={`mt-2 max-h-48 space-y-1`}>
						{options
							.filter((option) => option.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
							.map((option) => (
								<Combobox.Option
									key={option.value}
									value={option.value}
									className={({ active }) =>
										twMerge(
											'flex  cursor-pointer select-none items-center truncate rounded px-1.5 py-1',
											active ? 'bg-black bg-opacity-5 text-gray-900' : 'text-gray-900',
										)
									}
								>
									{({ selected }) => (
										<>
											<IconPointFilled size="20px" className={twMerge('mr-2', (option as any).color)} />
											{option.label}
											<div className="flex-1" />
											{selected && <IconCheck className="h-3.5 w-3.5" />}
										</>
									)}
								</Combobox.Option>
							))}
					</div>
				</Combobox.Options>
			</div>
		</Combobox>
	);
}

export { Select };

import { useDraggable } from '@dnd-kit/core';
import { IconAntennaBars5, IconDots } from '@tabler/icons-react';
import deepEqual from 'fast-deep-equal';
import React, { forwardRef, memo } from 'react';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import type { Database, TableModel } from 'worker/db';
import { useMergeRefs } from './useMergeRefs.hook';

type StandardComponentProps<T extends React.ElementType = React.ElementType> = Omit<
	React.ComponentPropsWithoutRef<T>,
	'children'
>;
type CardTemplateProps = { task: TableModel<Database['task_table']> } & StandardComponentProps<'div'>;

const CardTemplate = forwardRef(
	({ task, className, ...props }: CardTemplateProps, forwardedRef: React.ForwardedRef<HTMLDivElement>) => (
		<div
			ref={forwardedRef}
			className={twMerge(
				className,
				' select-none rounded-[4px] border border-[#dfe1e4] bg-white px-3.5 py-2.5 shadow-[#E6E6E6_0_1px_4px]',
			)}
			{...props}
		>
			<div className="flex items-center text-[#6b6f76]">
				<div className="mb-1 text-[12px] font-normal ">{task.slug}</div>
				<div className="flex-1" />
				<div className="-mr-1.5 -mt-1 grid h-[24px] w-[24px] cursor-pointer place-items-center hover:text-black">
					<IconDots size={16} />
				</div>
			</div>
			<div className="mb-2 flex max-w-full break-words text-[13px] font-medium leading-[16px]">{task.title}</div>
			<div className="flex gap-2">
				<div className="rounded-sm border">
					<IconAntennaBars5 size={16} strokeWidth={2} />
				</div>
			</div>
		</div>
	),
);

const EditableCard = forwardRef(
	({ task, ...props }: CardTemplateProps, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { setNodeRef, attributes, listeners } = useDraggable({
			id: `task-${task.id}`,
			data: {
				task,
			},
		});
		const navigate = useNavigate();

		return (
			<CardTemplate
				ref={useMergeRefs<HTMLDivElement | null>(forwardedRef, setNodeRef)}
				task={task}
				{...attributes}
				{...listeners}
				{...props}
				onClick={() => navigate(`#${task.id}`, { relative: 'path' })}
			/>
		);
	},
);

type CardProps = CardTemplateProps & { readonly?: boolean };

const Card = memo(
	forwardRef(({ readonly = false, ...props }: CardProps, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		return readonly ? <CardTemplate ref={forwardedRef} {...props} /> : <EditableCard ref={forwardedRef} {...props} />;
	}),
	deepEqual,
);

export { Card };

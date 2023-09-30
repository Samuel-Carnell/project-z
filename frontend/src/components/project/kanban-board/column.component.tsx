import { useDroppable } from '@dnd-kit/core';
import { IconPointFilled } from '@tabler/icons-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import deepEqual from 'fast-deep-equal';
import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { twMerge } from 'tailwind-merge';
import { Database, TableModel } from 'worker/db';
import { Card } from './card.component';
import { Status, Task } from './use-kanban';

const kanbanCardReferenceRoot = ReactDOM.createRoot(document.getElementById('kanban-reference-card-root')!);

const getReferenceCardHeight = () => {
	const referenceCardHeight: { current: null | number } = { current: null };
	kanbanCardReferenceRoot.render(
		<Card
			className="mb-2"
			readonly
			ref={(element) => {
				if (element === null) {
					return;
				}

				const dimensions = element.getBoundingClientRect();
				referenceCardHeight.current = dimensions.height;
				referenceCardHeight.current += parseInt(window.getComputedStyle(element).getPropertyValue('margin-top'));
				referenceCardHeight.current += parseInt(window.getComputedStyle(element).getPropertyValue('margin-bottom'));

				setTimeout(() => kanbanCardReferenceRoot.unmount(), 100);
			}}
			task={{
				id: '',
				description: 'DESCRIPTION',
				title: 'TITLE',
				index: -1,
				projectId: '',
				slug: 'SLUG',
				statusId: '',
			}}
		/>,
	);
	return referenceCardHeight;
};

const referenceCardHeight = getReferenceCardHeight();

type ColumnProps = {
	status: Status;
	tasks: Array<Task & { isPreview: boolean }>;
};

const Column = memo(({ status, tasks }: ColumnProps & { tasks: TableModel<Database['task_table']>[] }) => {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const pinToBottomRef = useRef(false);
	const { setNodeRef } = useDroppable({
		id: `status-${status.id}`,
		data: {
			statusId: status.id,
		},
	});

	const virtualizer = useVirtualizer({
		count: tasks.length,
		estimateSize: () => referenceCardHeight.current ?? 0,
		getScrollElement: () => scrollRef.current,
		overscan: 10,
		getItemKey: (index) => tasks[index].id,
	});

	useEffect(() => {
		const logScrollTop = () => {
			const currentScrollTop = scrollRef.current?.scrollTop ?? 0;
			const endScrollTop = Math.ceil(
				Math.max(virtualizer.getTotalSize() - scrollRef.current!.getBoundingClientRect().height, 0),
			);
			pinToBottomRef.current = endScrollTop - currentScrollTop < 30;
		};

		scrollRef.current?.addEventListener('scrollend', logScrollTop);
		return () => {
			scrollRef.current?.removeEventListener('scrollend', logScrollTop);
		};
	}, [virtualizer]);

	useLayoutEffect(() => {
		if (pinToBottomRef.current) {
			virtualizer.scrollToOffset(Number.MAX_VALUE);
		}
	}, [virtualizer, tasks.length]);

	useLayoutEffect(() => {
		const previewTaskInd = tasks.findIndex((task) => task.isPreview);
		if (previewTaskInd !== -1) {
			const previewInRange =
				virtualizer.range !== null &&
				previewTaskInd >= virtualizer.range.startIndex &&
				previewTaskInd <= virtualizer.range.endIndex;
			if (!previewInRange) {
				pinToBottomRef.current = false;
				virtualizer.scrollToIndex(previewTaskInd, { align: 'center' });
				return;
			}
		}
	}, [tasks, virtualizer]);

	const virtualNodes = virtualizer.getVirtualItems();
	const atTop = (scrollRef.current?.scrollTop ?? 0) < 50;
	return (
		<div className="flex h-full min-h-0 flex-col" ref={setNodeRef}>
			<div
				className={twMerge(
					'z-100 relative flex items-center pb-4 transition-shadow [clip-path:inset(0px_0px_-10px)] ',
					!atTop && 'shadow-[#B3B3B3_0_0_10px_0]',
				)}
			>
				{/* {Icon ? (
					<Icon size="18px" strokeWidth={2} className={twMerge('mr-3', iconColor)} />
				) : ( */}
				<IconPointFilled size="24px" strokeWidth={2} className={twMerge('mr-1', status.color)} />
				{/* )} */}
				<div className="text-[13px] font-medium">{status.title}</div>
			</div>
			<div
				style={{ overflowAnchor: 'none', overflowClipMargin: 0, touchAction: 'none' }}
				className="box-content min-h-0 w-[360px] flex-1 overflow-y-auto [scrollbar-width:thin]"
				ref={scrollRef}
			>
				<div style={{ height: virtualizer.getTotalSize() }} className="w-[350px]">
					<div style={{ paddingTop: virtualNodes[0]?.start ?? 0 }}>
						{virtualNodes.map((virtualNode) => {
							const item = tasks[virtualNode.index];
							return (
								<div className="mb-2" key={item.id}>
									{(() => {
										if (item.isPreview) {
											return <Card task={item} readonly className="opacity-50" />;
										}

										return <Card task={item} />;
									})()}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}, deepEqual);

export { Column };

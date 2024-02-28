import { IconPlus } from '@tabler/icons-react';
import { useObservableValue } from 'hooks/use-observable';
import { Link, useLocation } from 'react-router-dom';
import { Observable } from 'rxjs';

export const Header = ({ project$ }: { project$: Observable<any> }) => {
	const { pathname } = useLocation();

	const project = useObservableValue(project$, undefined);

	return (
		<div className="relative z-10 flex items-center border-b border-[#E5E5E5] bg-white px-4 py-3 ">
			<div className="grid h-7 w-7 place-items-center rounded-md bg-[#374151] text-[14px] text-white">
				{project?.title.value[0].toUpperCase()}
			</div>
			<div className="ml-3 text-[16px]">{project?.title.value}</div>
			<div className="flex-1" />
			<Link
				to={{ pathname, hash: 'new' }}
				className="flex rounded-[4px] border border-[#dfe1e4] bg-white px-2 py-0.5 text-[#3c4149] shadow-[#E6E6E6_0_1px_4px] hover:bg-[#f4f5f8]"
			>
				<IconPlus size={16} strokeWidth={1} style={{ marginTop: '0.5px' }} />
				<span className="ml-1.5 text-[12px] font-medium">New Task</span>
			</Link>
		</div>
	);
};

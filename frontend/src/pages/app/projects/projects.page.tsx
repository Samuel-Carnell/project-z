import { CreateProjectModal } from 'components/project/create-project-modal/create-project-modal';
import { filterByType, useEventSource } from 'eventsource';
import { useObservableValue } from 'hooks/use-observable';
import { usePersistent } from 'hooks/use-persistent';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { map } from 'rxjs';

const ProjectList = ({ onCreateNewProjectClick }: { onCreateNewProjectClick: () => void }) => {
	const source$ = useEventSource();
	const projects$ = usePersistent(() => source$.pipe(map((x) => filterByType(x, 'project'))));
	const projects = useObservableValue(projects$, []);
	return (
		<div className="grid h-full w-full place-items-center bg-[#f4f5f8]">
			<div className="mb-[64px]">
				<h1 className="text-center text-[32px] leading-[40px]">My Projects</h1>
				<div className="flex">
					<button className="my-[32px]" onClick={onCreateNewProjectClick}>
						<div className="h-[226px] rounded-[30px] p-[16px] duration-[.4s] hover:translate-y-[-4px] hover:bg-[#171717] hover:bg-opacity-[0.03]">
							<div className="grid h-[120px] w-[120px] place-items-center rounded-[16px] border border-dashed border-[#afabac] bg-white">
								<svg
									className="h-[32px] w-[32px]"
									fill="#b0acad"
									viewBox="0 0 32 32"
									aria-hidden="true"
									focusable="false"
								>
									<path d="M26,14h-8V6c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v8H6c-1.1,0-2,0.9-2,2l0,0c0,1.1,0.9,2,2,2h8v8c0,1.1,0.9,2,2,2l0,0c1.1,0,2-0.9,2-2v-8h8c1.1,0,2-0.9,2-2l0,0C28,14.9,27.1,14,26,14z"></path>
								</svg>
							</div>
							<p className="mt-[8px] text-center text-[14px]">Blank Project</p>
							<p className="mt-[4px] text-center text-[12px] text-[#6d6e6f]">Start from Scratch</p>
						</div>
					</button>
					{projects.map(({ title, id, urlId }) => (
						<Link key={id} className="my-[32px]" to={`/app/${urlId.value}/kanban`}>
							<div className="h-[226px] rounded-[30px] p-[16px] duration-[.4s] hover:translate-y-[-4px] hover:bg-[#171717] hover:bg-opacity-[0.03]">
								<div className="grid h-[120px] w-[120px] place-items-center rounded-[16px] border border-dashed border-[#afabac] bg-white">
									<div className="grid h-[60px] w-[60px] place-items-center rounded-md bg-[#374151] text-[36px] text-white">
										{title.value[0].toUpperCase()}
									</div>
								</div>
								<p className="mt-[8px] text-center text-[14px]">{title.value}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export const Projects = () => {
	const [showModal, setShowModal] = useState(false);
	return (
		<>
			{showModal && <CreateProjectModal onCloseModal={() => setShowModal(false)} />}
			<ProjectList onCreateNewProjectClick={() => setShowModal(true)} />
		</>
	);
};

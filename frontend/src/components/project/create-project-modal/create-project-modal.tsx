import { useConfig } from 'config';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import parse from 'style-to-object';
import { v4 as uuid } from 'uuid';
import './create-project-modal.css';

export const CreateProjectModal = ({ onCloseModal }: { onCloseModal: () => void }) => {
	const nameRef = useRef<HTMLInputElement | null>(null);
	const urlIdRef = useRef<HTMLInputElement | null>(null);
	const config = useConfig();
	const navigate = useNavigate();

	const createProject = () => {
		fetch(`${config.apiServer}/api/action/create-project`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				id: uuid(),
				title: nameRef.current?.value,
				urlId: urlIdRef.current?.value,
			}),
		});
		onCloseModal();
		navigate(`/app/${urlIdRef.current?.value}/kanban`);
	};
	return (
		<div
			className="absolute z-[999] grid h-full w-full place-items-center"
			style={{ background: 'rgba(30, 31, 33, 0.75)' }}
		>
			<div className="w-[560px] rounded-md bg-white" role="dialog" aria-modal="true">
				<div className="flex justify-between border-b border-[#edeae9] px-6 py-4">
					<h2 className="text-[20px]">Project&nbsp;details</h2>
					<button
						className="grid h-[28px] w-[28px] place-items-center rounded-[6px] fill-[#6d6e6f] transition-all duration-[0.2s] hover:bg-[#171717] hover:bg-opacity-[0.03] hover:fill-[#1e1f21] "
						aria-label="Close this dialog"
						aria-disabled="false"
						onClick={onCloseModal}
					>
						<svg className="Icon XIcon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
							<path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path>
						</svg>
					</button>
				</div>
				<div className="space-y-2 border-b border-[#edeae9] p-5 pb-7">
					<div>
						<label className="mb-[4px] block text-[12px] text-[#6d6e6f]">Name</label>
						<input
							ref={nameRef}
							className="block h-[36px] w-[300px] rounded-[6px] border border-solid border-[#cfcbcb] px-[12px] py-[6px] text-[14px] outline-none"
						/>
					</div>
					<div>
						<label className="mb-[4px] block text-[12px] text-[#6d6e6f]">URL ID</label>
						<input
							ref={urlIdRef}
							className="block h-[36px] w-[300px] rounded-[6px] border border-solid border-[#cfcbcb] px-[12px] py-[6px] text-[14px] outline-none"
						/>
					</div>
				</div>
				<div className="flex p-2">
					<div className="flex-1" />
					<button
						onClick={() => createProject()}
						style={
							parse(`
          display: inline-flex;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
  margin: 0px;
  border-radius: 4px;
  font-weight: 500;
  line-height: normal;
  transition-property: border, background-color, color, opacity;
  transition-duration: var(--speed-highlightFadeOut);
  user-select: none;
  position: relative;
  border: 1px solid rgb(109, 119, 212);
  box-shadow: rgba(0, 0, 0, 0.027) 0px 1px 2px;
  background-color: rgb(109, 119, 212);
  color: rgb(254, 254, 255);
  min-width: 28px;
  height: 28px;
  padding: 0px 14px;
  font-size: 12px;`) as any
						}
					>
						Create Project
					</button>
				</div>
			</div>
		</div>
	);
};

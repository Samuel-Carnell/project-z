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
			className="absolute z-[999] grid h-full w-full items-center justify-center"
			style={{ background: 'rgba(30, 31, 33, 0.75)' }}
		>
			<div
				className="ModalWrapper ModalWrapper--sizeSmall Modal rounded-md "
				role="dialog"
				aria-modal="true"
				aria-labelledby="Modal-headinglui_736"
			>
				<div className="ModalWrapper-childContainer">
					<div className="ModalHeader ModalHeader--sizeSmall Modal-header Stack Stack--align-center Stack--direction-row Stack--display-block Stack--justify-space-between !h-auto">
						<h2
							className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--h4 TypographyPresentation--fontWeightMedium !py-4"
							id="Modal-headinglui_736"
						>
							Project&nbsp;details
						</h2>
						<div
							role="button"
							aria-label="Close this dialog"
							className="ThemeableIconButtonPresentation--isEnabled ThemeableIconButtonPresentation ThemeableIconButtonPresentation--medium SubtleIconButton--standardTheme SubtleIconButton ModalHeader-closeButton"
							aria-disabled="false"
							onClick={onCloseModal}
						>
							<svg className="Icon XIcon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
								<path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path>
							</svg>
						</div>
					</div>
					<div
						className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical ModalContent ModalContent--sizeSmall !p-5 !pb-7"
						role="presentation"
					>
						<div className="ProjectInhtmlFormationDialogContent">
							<div
								className="ProjectInhtmlFormationDialogContent-row "
								data-dashlane-rid="11ac46aacb33f6ec"
								data-htmlForm-type="other"
							>
								<div className="htmlFormRowStructure--labelPlacementTop htmlFormRowStructure ProjectInhtmlFormationDialogContent-nameField flex-1">
									<div className="htmlFormRowStructure-label mb-1.5">
										<label className="LabelBase LabelPresentation" htmlFor="lui_740">
											Name
										</label>
									</div>
									<div className="htmlFormRowStructure-contents" data-dashlane-rid="2e7eade57a4aa88b">
										<input
											ref={nameRef}
											className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium ProjectInhtmlFormationDialogContent-textInput w-[350px]"
											type="text"
											id="lui_740"
											data-dashlane-rid="7d4c27ca58e18202"
											data-htmlForm-type="other"
										/>
									</div>
								</div>
								<div className="htmlFormRowStructure--labelPlacementTop htmlFormRowStructure ProjectInhtmlFormationDialogContent-nameField mt-2 flex-1">
									<div className="htmlFormRowStructure-label mb-1.5">
										<label className="LabelBase LabelPresentation" htmlFor="lui_740">
											URL ID
										</label>
									</div>
									<div
										className="htmlFormRowStructure-contents"
										data-dashlane-rid="2e7eade57a4aa88b"
										data-htmlForm-type="other"
									>
										<input
											ref={urlIdRef}
											className="TextInputBase SizedTextInput SizedTextInput--medium TextInput TextInput--medium ProjectInhtmlFormationDialogContent-textInput w-[350px]"
											type="text"
											id="lui_740"
											data-dashlane-rid="d3c085589c5c6e3a"
											data-htmlForm-type="other"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={{ borderTop: '1px solid var(--color-border)' }} className="flex p-2">
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
		</div>
	);
};

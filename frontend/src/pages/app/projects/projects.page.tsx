import { CreateProjectModal } from 'components/project/create-project-modal/create-project-modal';
import { filterByType, useEventSource } from 'eventsource';
import { useObservableValue } from 'hooks/use-observable';
import { usePersistent } from 'hooks/use-persistent';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { map } from 'rxjs';
import './projects.css';

const ProjectList = ({ onCreateNewProjectClick }: { onCreateNewProjectClick: () => void }) => {
	const source$ = useEventSource();
	const projects$ = usePersistent(() => source$.pipe(map((x) => filterByType(x, 'project'))));
	const projects = useObservableValue(projects$, []);
	return (
		<div className="Breakpoint--defaultDesktopStyles DesignTokensDefault DesignTokenThemeSelectors-theme--higherContrastLoadingPlaceholder snipcss-wlOUA">
			<div id="asana" className="notranslate">
				<div className="ModalManager"></div>
				<div className="ToastManager--zIndexIncluded ToastManager"></div>
				<div className="AppRoot">
					<div className="ThemeSetter-themeBackground ThemeSetter--classic"></div>
					<div id="asana_full_page" className="AppRoot-fullPage" aria-hidden="true">
						<div className="AsanaMain">
							<div id="asana_main" className="AsanaMain-mainLayer">
								<div className="LearningHubTransitionManager"></div>
								<div
									id="asana_sidebar"
									className="SidebarResizableContainer AsanaMain-sidebarResizableContainer style-FVl26"
								>
									<div className="SidebarResizableContainer-sidebarWrapper style-pURUy" id="style-pURUy">
										<div className="Sidebar SidebarResizableContainer-sidebar">
											<nav
												className="SidebarCollapsibleSection--isFirstSection SidebarCollapsibleSection--isExpanded SidebarCollapsibleSection SidebarTopNavLinks"
												aria-label="Global"
											>
												<div className="RightClickMenu-contextMenuEventListener">
													<a
														aria-label="Home"
														href="/app/test/kanban"
														className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-homeButton is-selected BaseLink"
													>
														<div className="SidebarNavigationLinkCard-icon">
															<svg
																className="NavIcon HomeNavIcon"
																viewBox="0 0 40 40"
																aria-hidden="true"
																focusable="false"
															>
																<path d="M37.9,15L22.2,3.8c-1.3-1-3.1-1-4.4-0.1L2.2,14.4c-0.7,0.5-0.9,1.4-0.4,2.1c0.5,0.7,1.4,0.9,2.1,0.4L6,15.4v12.3c0,4.6,3.7,8.3,8.3,8.3h11.4c4.6,0,8.3-3.7,8.3-8.3V15.9l2.1,1.5c0.3,0.2,0.6,0.3,0.9,0.3c0.5,0,0.9-0.2,1.2-0.6C38.7,16.4,38.5,15.5,37.9,15z M31,27.7c0,2.9-2.4,5.3-5.3,5.3H14.3C11.4,33,9,30.6,9,27.7V13.3l10.6-7.2c0.2-0.2,0.5-0.2,0.8,0L31,13.7V27.7z"></path>
															</svg>
														</div>
														<span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--m SidebarNavigationLinkCard-label">
															Home
														</span>
														<div className="SidebarNavigationLinkCard-spacer"></div>
													</a>
												</div>
												<div className="RightClickMenu-contextMenuEventListener">
													<a
														aria-label="My tasks"
														href="/app/test/kanban"
														className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-myTasksButton BaseLink"
													>
														<div className="SidebarNavigationLinkCard-icon">
															<svg
																className="NavIcon CheckNavIcon"
																viewBox="0 0 40 40"
																aria-hidden="true"
																focusable="false"
															>
																<path d="M20,2.5C10.4,2.5,2.5,10.4,2.5,20S10.4,37.5,20,37.5S37.5,29.6,37.5,20S29.6,2.5,20,2.5z M20,34.5C12,34.5,5.5,28,5.5,20S12,5.5,20,5.5S34.5,12,34.5,20S28,34.5,20,34.5z M27.7,15c0.6,0.6,0.6,1.5,0,2.1l-10,10c-0.2,0.2-0.6,0.3-1,0.3c-0.4,0-0.8-0.1-1.1-0.4l-4.1-4.1c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l3.1,3.1l8.9-8.9C26.2,14.4,27.1,14.4,27.7,15z"></path>
															</svg>
														</div>
														<span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--m SidebarNavigationLinkCard-label">
															My tasks
														</span>
														<div className="SidebarNavigationLinkCard-spacer"></div>
													</a>
												</div>
												<div className="RightClickMenu-contextMenuEventListener">
													<a
														aria-label="Inbox"
														href="/app/test/kanban"
														className="ThemeableCardPresentation--isValid ThemeableCardPresentation ThemeableInteractiveCardPresentation--isNotSelected ThemeableInteractiveCardPresentation--isEnabled ThemeableInteractiveCardPresentation SidebarNavigationLinkCard SidebarItemRow SidebarTopNavLinks-notificationsButton BaseLink"
													>
														<div className="SidebarNavigationLinkCard-icon">
															<svg
																className="NavIcon BellNavIcon"
																viewBox="0 0 40 40"
																aria-hidden="true"
																focusable="false"
															>
																<path d="M7.5,32L7.5,32h-1c-1.5,0-2.8-0.8-3.4-2c-0.8-1.5-0.4-3.4,0.9-4.5c1.2-1,1.9-2.4,2-3.9v-6.1C6,8.1,12.3,2,20,2s14,6.1,14,13.5V22c0.2,1.4,0.9,2.6,2,3.5c1.3,1.1,1.7,2.9,0.9,4.5c-0.6,1.2-2,2-3.4,2h-0.9H7.5z M7.6,29h25.8c0.3,0,0.7-0.2,0.8-0.4c0.2-0.4,0-0.7-0.2-0.8l0,0c-1.6-1.4-2.7-3.3-3-5.5c0-0.1,0-0.1,0-0.2v-6.6C31,9.7,26.1,5,20,5S9,9.7,9,15.5v6.1v0.1c-0.2,2.4-1.3,4.5-3.1,6c-0.2,0.2-0.3,0.5-0.2,0.8C5.9,28.8,6.2,29,6.5,29H7.6L7.6,29z M24.7,34c-0.7,1.9-2.5,3.2-4.7,3.2s-4-1.3-4.7-3.2H24.7z"></path>
															</svg>
														</div>
														<span className="TypographyPresentation TypographyPresentation--colorNavigation TypographyPresentation--overflowTruncate TypographyPresentation--m SidebarNavigationLinkCard-label">
															Inbox
														</span>
														<div className="SidebarNavigationLinkCard-spacer"></div>
													</a>
												</div>
											</nav>
											<div className="CustomScrollbarScrollable Sidebar-customScrollbarScrollable">
												<div
													className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical CustomScrollbarScrollable-scrollable"
													data-testid="VerticalScroller"
													role="presentation"
												>
													<div className="ResizeListener">
														<div className="ResizeListener-expand">
															<div className="ResizeListener-expandChild"></div>
														</div>
														<div className="ResizeListener-shrink">
															<div className="ResizeListener-shrinkChild"></div>
														</div>
													</div>
												</div>
												<div className="CustomScrollbarScrollable-track style-Af9j7" id="style-Af9j7">
													<div className="CustomScrollbarScrollable-thumb" role="presentation"></div>
												</div>
											</div>
											<div className="Sidebar-cleanAndClearInviteAndHelpSection">
												<div
													role="button"
													className="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large SubtleButton--inverseTheme SubtleButton SidebarInvite Sidebar-stickyInvite"
												>
													<img
														className="MiniIllustration MiniIllustration--xsmallAvatar ThemeableRectangularButtonPresentation-leftIcon"
														alt=""
														src="https://d3ki9tyy5l5ruj.cloudfront.net/obj/94c2a499b51d9f3439c63eb3d51b7616753733b5/20px_logo.svg"
													/>
													Invite
												</div>
												<div className="Sidebar-cleanAndClearInviteAndHelpSectionDivider"></div>
												<div
													role="button"
													aria-expanded="false"
													className="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large SubtleButton--inverseTheme SubtleButton SidebarLearningHubButton Sidebar-learningHubButton"
												>
													<div className="ThemeableRectangularButtonPresentation-leftIcon SidebarLearningHubButton-icon">
														<svg
															className="Icon QuestionMarkCircleIcon"
															viewBox="0 0 32 32"
															aria-hidden="true"
															focusable="false"
														>
															<path d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16C32,7.2,24.8,0,16,0 M16,2c7.7,0,14,6.3,14,14s-6.3,14-14,14S2,23.7,2,16C2,8.3,8.3,2,16,2 M14,24.4c-0.1-0.8,0.6-1.5,1.4-1.6c0,0,0.1,0,0.1,0c0.8,0,1.5,0.6,1.5,1.4c0,0.1,0,0.1,0,0.2c0,0.8-0.5,1.5-1.3,1.5c-0.1,0-0.1,0-0.2,0c-0.8,0.1-1.4-0.5-1.5-1.2C14,24.6,14,24.5,14,24.4 M15.8,7.1c3.3,0,5.6,2.1,5.6,4.8c0,1.9-1.1,3.7-2.8,4.6c-1.7,1-2.2,1.7-2.2,3.1v0.9h-2.3v-1.2c0-1.8,0.8-3,2.7-4c1.5-0.9,2.1-1.8,2.1-3.2c-0.1-1.7-1.4-3-3.1-2.9c-0.1,0-0.1,0-0.2,0c-1.7-0.1-3.2,1.1-3.4,2.9c0,0.1,0,0.2,0,0.2H10C10.2,9.4,12.1,7.1,15.8,7.1"></path>
														</svg>
													</div>
													Help
												</div>
											</div>
										</div>
									</div>
									<div className="ResizeSlider-dragAnchor--isOnRightSideOfResizableElement ResizeSlider-dragAnchor SidebarResizableContainer-resizeSliderDragAnchor">
										<div className="ResizeSlider-visibleLine"></div>
									</div>
								</div>
								<main className="AsanaMain-asanaPageAndTopbar" id="asana_main_page">
									<img
										className="HomePageContent-backgroundLoader"
										src="https://d3ki9tyy5l5ruj.cloudfront.net/obj/d608b19504e2d342bdcf8699006bf6e7f00f7793/classic_home_background.png"
									/>
									<div className="HomePageContent style-QT629" id="style-QT629">
										<div
											className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical HomePageContent-contentContainer"
											role="presentation"
										>
											<div className="AsanaBaseTopbar AsanaBaseTopbar--withoutShadow AsanaBaseTopbar--home AsanaBaseTopbar--zIndexIncluded Stack Stack--align-center Stack--direction-row Stack--display-block Stack--justify-start">
												<div className="AsanaBaseTopbar-pageHeader Stack--spacer Stack Stack--align-stretch Stack--direction-row Stack--display-inline Stack--justify-start">
													<div className="TopbarPageHeaderStructure Stack Stack--align-stretch Stack--direction-row Stack--display-block Stack--justify-start">
														<div className="Stack--spacer Stack Stack--align-stretch Stack--direction-row Stack--display-block Stack--justify-start">
															<div className="TopbarPageHeaderStructure-titleAndNav">
																<div className="TopbarPageHeaderStructure-titleRow--withoutNav TopbarPageHeaderStructure-titleRow">
																	<h1
																		className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--overflowTruncate TypographyPresentation--h4 TypographyPresentation--fontWeightMedium TopbarPageHeaderStructureHeading"
																		id="lui_48"
																	>
																		Home
																	</h1>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="TopbarPageHeaderGlobalActions AsanaBaseTopbar-globalActions"></div>
											</div>
										</div>
										<div className="HomePageContent-customizationPaneContainer"></div>
									</div>
									<div className="AsanaMain-quickAddPopOut--zIndexIncluded AsanaMain-quickAddPopOut">
										<div className="PopOutBoundary"></div>
									</div>
								</main>
								<div className="AppRoot-disconnectBar--sidebarExpanded AppRoot-disconnectBar">
									<div className="DisconnectBarManager"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div data-layerid="0" className="">
				<div className="DecorativeModalLayer--zIndexIncluded DecorativeModalLayer ProjectCreationModal">
					<div className="Scrollable Scrollable--vertical DecorativeModalLayer-scrollable" role="presentation">
						<div className="DecorativeModalLayer-desktopTopbarBuffer"></div>
						<div className="FullScreenModal-modal" role="dialog" aria-modal="true">
							<div className="ProjectCreationModalContent style-ABVCm" id="style-ABVCm">
								<div
									className="Scrollable--withCompositingLayer Scrollable Scrollable--vertical ProjectCreationModalContent-interstitial ProjectCreationModalContent-body"
									role="presentation"
								>
									<div className="ProjectCreationFlowPicker">
										<div className="ProjectCreationFlowPicker-titles">
											<h2 className="TypographyPresentation TypographyPresentation--colorDefault TypographyPresentation--h2 TypographyPresentation--fontWeightNormal TypographyPresentation--textAlignCenter ProjectCreationFlowPicker-title">
												My Projects
											</h2>
										</div>
										<div className="ProjectCreationFlowPicker-content">
											<div className="ProjectCreationFlowPicker-tiles">
												<button
													className="TileStructure TileStructure--sizeNormal FlowPickerTile"
													onClick={onCreateNewProjectClick}
												>
													<div className="TileStructure-children">
														<div className="DashedTile DashedTile--large FlowPickerTile-dashedTile">
															<svg
																className="Icon--large Icon DashedTile-icon PlusIcon"
																viewBox="0 0 32 32"
																aria-hidden="true"
																focusable="false"
															>
																<path d="M26,14h-8V6c0-1.1-0.9-2-2-2l0,0c-1.1,0-2,0.9-2,2v8H6c-1.1,0-2,0.9-2,2l0,0c0,1.1,0.9,2,2,2h8v8c0,1.1,0.9,2,2,2l0,0c1.1,0,2-0.9,2-2v-8h8c1.1,0,2-0.9,2-2l0,0C28,14.9,27.1,14,26,14z"></path>
															</svg>
														</div>
													</div>
													<div className="TileStructure-name">Blank project</div>
													<div className="TileStructure-subTitle">Start from scratch</div>
												</button>
												{projects.map((x) => (
													<Link
														className="TileStructure TileStructure--sizeNormal FlowPickerTile"
														to={`/app/${x.urlId.value}/kanban`}
													>
														<div className="TileStructure-children">
															<div className="FlowPickerTile-box FlowPickerTile-box--solidBorder">
																<div className="grid h-[60px] w-[60px] place-items-center rounded-md bg-[#374151] text-[36px] text-white">
																	{x.title.value[0].toUpperCase()}
																</div>
															</div>
														</div>

														<div className="TileStructure-name">{x.title.value}</div>
														{/* <div className="TileStructure-subTitle">Choose from library</div> */}
													</Link>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="LayerContext-layerContainer"></div>
					</div>
				</div>
			</div>
			<div data-layerid="1">
				<div
					className="LayerPositioner--animatePositionChanges LayerPositioner--zIndexIncluded CueAnchor-layerPositioner LayerPositioner LayerPositioner--alignLeft LayerPositioner--below style-erVdy"
					role="presentation"
					id="style-erVdy"
				>
					<div className="LayerPositioner-layer">
						<div className="ResizeListener">
							<div className="ResizeListener-expand">
								<div className="ResizeListener-expandChild"></div>
							</div>
							<div className="ResizeListener-shrink">
								<div className="ResizeListener-shrinkChild"></div>
							</div>
						</div>
					</div>
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

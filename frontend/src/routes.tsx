import { useConfig } from 'config';
import { AppPage } from 'pages/app/app.page';
import { KanbanPage } from 'pages/app/project/kanban/kanban.page';
import ProjectPage from 'pages/app/project/project.page';
import { Projects } from 'pages/app/projects/projects.page';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/sign-in" element={<SignIn />} />
			<Route path="/sign-in/oauth/:provider" element={<OAuthSignIn />} />
			<Route path="/app" element={<AppPage />}>
				<Route path=":projectId" element={<ProjectPage className="min-w-0 flex-1" />}>
					<Route path="kanban" element={<KanbanPage className="min-h-0 flex-1" />} />
				</Route>
				<Route path="projects" element={<Projects />} />
			</Route>
			<Route path="/" element={<Navigate to="/app/projects" />} />
		</Routes>
	);
};

const SignIn = () => {
	const config = useConfig();
	const githubOAuthConfig = config.oauth.github;
	const signIn = () => {
		const queryParam = new URLSearchParams();
		queryParam.append('client_id', githubOAuthConfig.clientId);
		queryParam.append('scope', githubOAuthConfig.scope);
		window.location.replace(`https://github.com/login/oauth/authorize?${queryParam}`);
	};

	return (
		<div className="grid h-screen w-screen place-items-center bg-[#f4f5f8]">
			<div className="mb-[64px]">
				<button
					className="focus:shadow-outline flex items-center justify-center rounded-lg bg-indigo-100 px-10 py-3 text-lg font-semibold text-gray-800 shadow-sm transition-all duration-300 ease-in-out hover:shadow focus:shadow-sm focus:outline-none"
					onClick={signIn}
				>
					<div className="rounded-full bg-white p-1">
						<svg className="w-6" viewBox="0 0 32 32">
							<path
								fill-rule="evenodd"
								d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
							/>
						</svg>
					</div>
					<span className="ml-4">Sign In with GitHub</span>
				</button>
			</div>
		</div>
	);
};

const OAuthSignIn = () => {
	const { provider } = useParams();
	const [queryParams] = useSearchParams();
	const config = useConfig();
	const navigate = useNavigate();

	useEffect(() => {
		const authorizationCode = queryParams.get('code');
		fetch(`${config.apiServer}/api/sign-in/oauth/${provider}?code=${authorizationCode}`, {
			credentials: 'include',
		}).then(() => navigate('/app/projects'));
	}, []);

	return <div />;
};

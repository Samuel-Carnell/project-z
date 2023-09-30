import { insert, insertMany } from 'blinkdb';
import { v4 as uuid } from 'uuid';
import { Database } from './db';
import { Project } from './models/project';
import { Task } from './models/task';

export async function seed(db: Database) {
	const project: Project = {
		id: 'aa27f680-d644-454c-bad4-1db11c0d762c',
		title: 'My Project',
		statuses: [
			{
				id: 'ba7c2ac3-276a-458d-8d4d-ab0f3b5a7e05',
				title: 'Todo',
				order: 1,
				color: 'text-gray-500',
			},
			{
				id: '94331c09-30d0-4c7b-8748-4ba9b023a2b9',
				title: 'In Progress',
				order: 2,
				color: 'text-amber-500',
			},
			{
				id: '3641dc00-90df-4c8f-b56c-b49d17addbd9',
				title: 'Done',
				order: 3,
				color: 'text-green-600',
			},
		],
	};

	const tasks = new Array(10000).fill(null).map(
		(_, ind): Task => ({
			id: uuid(),
			projectId: project.id,
			statusId: project.statuses[0].id,
			description: [{ type: 'p', children: [{ text: '' }] }],
			title: 'Some Title',
			slug: 'MP-' + (ind + 1),
			index: ind,
		}),
	);

	await insert(db.project_table, project);
	await insertMany(db.task_table, tasks);
}

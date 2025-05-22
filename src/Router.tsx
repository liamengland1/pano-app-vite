// https://gist.github.com/thisanimus/aad22d1dbad33fd2d7a586b0b0e26250

import { JSX } from 'react';
import {
	createHashRouter,
	LoaderFunction,
	ActionFunction,
} from 'react-router-dom';

interface IRoute {
	path: string;
	Element: JSX.Element;
	loader?: LoaderFunction;
	action?: ActionFunction;
	ErrorBoundary?: JSX.Element;
}

const pages = import.meta.glob('/src/pages/**/[a-z[]*.tsx', { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
	const fileName = path
		.replace(/\/src\/pages|index|\.tsx$/g, '')
		.replace(/\[\.{3}.+\]/, '*')
		.replace(/\[(.+)\]/, ':$1');

	routes.push({
		path: fileName === 'index' ? '/' : `${fileName.toLowerCase()}`,
		// @ts-ignore
		Element: pages[path].default,
		// @ts-ignore
		loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
		// @ts-ignore
		action: pages[path]?.action as unknown as ActionFunction | undefined,
		// @ts-ignore
		ErrorBoundary: pages[path]?.ErrorBoundary as unknown as JSX.Element,
	});
}

const router = createHashRouter(
	routes.map(({ Element, ErrorBoundary, ...rest }) => ({
		...rest,
		// @ts-ignore
		element: <Element />,
		// @ts-ignore
		...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
	}))
  );



export default router;
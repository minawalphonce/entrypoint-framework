import React, { useEffect, useMemo, useState } from 'react';
import { extendTheme, defaultTheme, ThemeProvider } from "@inkjs/ui";
import { Box, useStdout } from "ink";
// import { colorNames } from "chalk";

import { Args, Config } from './types.js';
import { useTaskManager } from "./store/index.js";
import { PrepareView } from "./components/prepare-view.js";
import { LogEntry } from './components/log-entry.js';
import Sidebar from './components/side-bar.js';
import ContentView from './components/content-view.js';

export type AppProps = {
	config: Config,
	args: Args
}

export default function App({ config, args }: AppProps) {
	const theme = useMemo(() => {
		return extendTheme(defaultTheme, {
			components: {
				ProgressBar: {
					styles: {
						completed: () => {
							return {
								color: "green"
							}
						}
					}
				}
			}
		});
	}, []);
	const { stdout } = useStdout();
	const [dimensions, setDimensions] = useState<[number, number]>([
		stdout.columns,
		stdout.rows,
	]);

	useEffect(() => {
		const onResize = () => {
			setDimensions([stdout.columns, stdout.rows]);
		};

		// Listen for resize events
		stdout.on('resize', onResize);

		// Cleanup
		return () => {
			stdout.off('resize', onResize);
		};
	}, [stdout]);

	const [width, height] = dimensions;

	const start = useTaskManager(state => state.start);
	const isWatching = useTaskManager(state => state.isWatching);
	// const watchTask = useTaskManager(selectRootTasks())[0];
	// if (!watchTask?.logs?.length) {
	// 	return null;
	// }
	// const maxLogs = 10;
	// const displayLogs = maxLogs ? watchTask.logs.slice(-maxLogs) : watchTask.logs;
	useEffect(() => {
		start(config, args.inputs.env);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			{!isWatching && <PrepareView />}
			{isWatching && <Box width={width} height={height} flexDirection="row">
				<Sidebar />
				<ContentView />
				{/* <LogEntry log={displayLogs[displayLogs.length - 1]} /> */}
			</Box>}
		</ThemeProvider>
	)
}

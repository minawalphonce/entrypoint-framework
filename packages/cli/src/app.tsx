import React, { useEffect, useMemo } from 'react';
import { extendTheme, defaultTheme, ThemeProvider } from "@inkjs/ui";
import { colorNames } from "chalk";

import { Args, Config } from './types.js';
import { useTaskManager } from "./store/index.js";
import { PrepareView } from "./components/prepare-view.js";

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
	const start = useTaskManager(state => state.start);
	useEffect(() => {
		start(config, args.inputs.env);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<PrepareView />
		</ThemeProvider>
	)
}

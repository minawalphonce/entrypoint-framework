import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import { Box, Text } from "ink";
import { ProgressBar, StatusMessage, Spinner } from "@inkjs/ui";

import { useTaskManager, selectTask, selectProgress, selectRootTasks } from "../store/index.js";

interface TaskStatusProps {
    taskId: string;
    isActive: boolean;
    indent?: number;
}

const LogEntry: FC<{ log: any }> = ({ log }) => {
    if (typeof log !== 'string' && 'text' in log) {
        // Handle esbuild message
        const location = log.location ? `${log.location.file}:${log.location.line}:${log.location.column}` : '';
        const details = log.detail ? `\n${log.detail}` : '';
        const notes = log.notes?.map(note => note.text).join('\n');
        const prefix = log.pluginName ? `[${log.pluginName}] ` : '';

        return (
            <Box flexDirection="column">
                <Text color="yellow">
                    ⚠ {prefix}{log.text}
                </Text>
                {location && (
                    <Text dimColor> at {location}</Text>
                )}
                {details && (
                    <Text>{details}</Text>
                )}
                {notes && (
                    <Text dimColor>{notes}</Text>
                )}
            </Box>
        );
    }

    // Handle string log
    const logLevelMatch = log.match(/^\[(info|error|warning)\]/i);
    const level = logLevelMatch ? logLevelMatch[1].toLowerCase() : 'info';
    const message = logLevelMatch ? log.slice(logLevelMatch[0].length).trim() : log;

    const getLogColor = () => {
        switch (level) {
            case 'error':
                return 'red';
            case 'warning':
                return 'yellow';
            case 'info':
            default:
                return 'white';
        }
    };

    const getLogPrefix = () => {
        switch (level) {
            case 'error':
                return '✖';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    return (
        <Box>
            <Text color={getLogColor()}>
                {getLogPrefix()} {message}
            </Text>
        </Box>
    );
};

const TaskLogs: FC<{
    taskId: string;
    maxLogs?: number;
}> = ({ taskId, maxLogs = 5 }) => {
    const task = useTaskManager(state => state.tasks[taskId]);

    if (!task?.logs?.length) {
        return null;
    }

    const displayLogs = maxLogs ? task.logs.slice(-maxLogs) : task.logs;

    return (
        <Box flexDirection="column" marginLeft={4}>
            {displayLogs.map((log, index) => (
                <LogEntry key={`${taskId}-log-${index}`} log={log} />
            ))}
        </Box>
    );
};

export const TaskStatus: FC<TaskStatusProps> = ({ taskId, isActive, indent = 0 }) => {
    const task = useTaskManager(selectTask(taskId));
    const currentTaskId = useTaskManager(state => state.currentTaskId);

    const getStatusVariant = () => {
        if (task.error) return 'error';
        if (task.status === "completed" && !task.error) return 'success';
        if (task.status === "skipped") return 'info';
        if (task.status === "running") return 'info';
        return 'warning';
    };
    const shouldShowLogs = isActive || task.status === "error";

    return (
        <Box flexDirection="column">
            <Box>
                <Text>{'  '.repeat(indent)}</Text>
                {isActive
                    ? <Spinner label={task.title} />
                    : <StatusMessage variant={getStatusVariant()}>
                        {task.status === "skipped" ? '⏭' : undefined} {task.title}
                        {task.error && (
                            <Text color="red"> - {task.error}</Text>
                        )}
                    </StatusMessage>
                }
            </Box>
            {shouldShowLogs && <TaskLogs taskId={task.id} />}
            {task.children?.map((child, index) => (
                <TaskStatus
                    key={`${child}-${index}`}
                    taskId={child}
                    isActive={task.id === currentTaskId}
                    indent={indent + 1}
                />
            ))}
        </Box>
    );
};

export const BuildProgress: FC = () => {
    const progress = useTaskManager(selectProgress());
    const tasks = useTaskManager(useShallow(selectRootTasks()));
    const currentTaskId = useTaskManager(state => state.currentTaskId);
    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <ProgressBar value={progress * 100} />
            </Box>
            <Box flexDirection="column">
                {Object.values(tasks).map((task) => (
                    <TaskStatus
                        key={task.id}
                        taskId={task.id}
                        isActive={task.id === currentTaskId}
                    />
                ))}
            </Box>
        </Box>
    );
};

export function PrepareView() {
    return (
        <Box flexDirection="column">
            <BuildProgress />
        </Box>
    );
}
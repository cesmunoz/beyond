const KEY_SPLITTER = '^';

export const createProcessKey = (processId: string, coacheeId: string): string =>
  `${processId}${KEY_SPLITTER}${coacheeId}`;

export const parseProcessKey = (key: string): string[] => key.split(KEY_SPLITTER);

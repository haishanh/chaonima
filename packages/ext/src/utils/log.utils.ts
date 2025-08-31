let muted = false;

function base(fn: 'log' | 'warn' | 'error', a: string, ...args: unknown[]) {
  if (muted) return;
  const style = 'background-color: #f1f1f1; color: #111;';
  console[fn]('%cchaonima%c ' + a, style, 'color:unset', ...args);
}

export const logger = {
  info: (a: string, ...args: unknown[]) => base('log', a, ...args),
  warn: (a: string, ...args: unknown[]) => base('warn', a, ...args),
  error: (a: string, ...args: unknown[]) => base('error', a, ...args),
};

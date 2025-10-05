export async function register() {
  // Called once on the server when the app starts. Good place to wire basic observers.
  try {
    // Minimal process listeners for visibility during development
    process.on("uncaughtException", (err) => {
      // eslint-disable-next-line no-console
      console.error("[instrumentation] uncaughtException", err);
    });
    process.on("unhandledRejection", (reason) => {
      // eslint-disable-next-line no-console
      console.error("[instrumentation] unhandledRejection", reason);
    });
    // eslint-disable-next-line no-console
    console.log(`[instrumentation] register at ${new Date().toISOString()}`);
  } catch {}
}

export function onRequestError(err: unknown) {
  // eslint-disable-next-line no-console
  console.error("[instrumentation] onRequestError", err);
}

export function onUnhandledError(err: unknown) {
  // eslint-disable-next-line no-console
  console.error("[instrumentation] onUnhandledError", err);
}


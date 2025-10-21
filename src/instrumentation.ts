export async function register() {

  try {

    process.on("uncaughtException", (err) => {

      console.error("[instrumentation] uncaughtException", err);
    });
    process.on("unhandledRejection", (reason) => {

      console.error("[instrumentation] unhandledRejection", reason);
    });

    console.log(`[instrumentation] register at ${new Date().toISOString()}`);
  } catch {}
}

export function onRequestError(err: unknown) {

  console.error("[instrumentation] onRequestError", err);
}

export function onUnhandledError(err: unknown) {

  console.error("[instrumentation] onUnhandledError", err);
}

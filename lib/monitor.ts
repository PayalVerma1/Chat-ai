import { Monitor } from "@keo-platform/monitor-sdk";

const apiKey = process.env.KEO_API_KEY;
const serviceId = process.env.KEO_SERVICE_ID;
const baseUrl = process.env.KEO_BASE_URL;

const monitorInstance =
  apiKey && serviceId && baseUrl
    ? (() => {
        const instance = new Monitor({
          apiKey,
          serviceId,
          baseUrl,
          metricsInterval: Number(process.env.KEO_METRICS_INTERVAL ?? 30000),
          logBatchSize: Number(process.env.KEO_LOG_BATCH_SIZE ?? 10),
        });
        instance.start();
        return instance;
      })()
    : null;

export const monitor = monitorInstance;
export const isMonitorEnabled = Boolean(apiKey && serviceId && baseUrl);

export function withMonitorMiddleware(req: any, res: any, next: () => void) {
  if (!monitor) return next();
  return monitor.middleware()(req, res, next);
}

export function logMonitor(level: "info" | "warn" | "error", message: string) {
  if (!monitor) return;
  if (level === "info") monitor.log.info(message);
  if (level === "warn") monitor.log.warn(message);
  if (level === "error") monitor.log.error(message);
}

export async function trackDeployment(version = process.env.npm_package_version ?? "local") {
  if (!monitor) return;
  await monitor.deployments.track(version);
}

import React, { useEffect } from "react";

export interface VersionCheckProps {
  onUpdate: (versionInfo: VersionInfo) => void;
  children?: React.ReactNode;
  /** Worker 脚本路径，默认 `/versionCheck.worker.js`*/
  workerPath?: string;
}

export interface VersionInfo {
  version: string;
  forceUpdate: boolean;
}

export const VersionCheck: React.FC<VersionCheckProps> = ({
  onUpdate,
  children,
  workerPath = "/versionCheck.worker.js",
}) => {
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === "production";
    if (!isProduction) return;

    const workerUrl = `${workerPath}?t=${Date.now()}`;
    const worker = new Worker(workerUrl);

    worker.onmessage = (
      event: MessageEvent<{ type: string; payload?: VersionInfo }>,
    ) => {
      const { type, payload } = event.data;
      if (type === "update" && payload) onUpdate(payload);
    };

    worker.onerror = (error) =>
      console.error("[VersionCheck] Worker 错误:", error);

    worker.postMessage({ type: "init" });

    return () => worker.terminate();
  }, [onUpdate, workerPath]);

  return <>{children}</>;
};

import React, { useEffect } from "react";

export interface VersionCheckProps {
  onUpdate: (versionInfo: VersionInfo) => void;
  children?: React.ReactNode;
}

export interface VersionInfo {
  version: number;
  forceUpdate: boolean;
}

export const VersionCheck: React.FC<VersionCheckProps> = ({
  onUpdate,
  children,
}) => {
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === "production";
    if (!isProduction) return;

    // 添加时间戳避免缓存
    const workerUrl = `/versionCheck.worker.js?t=${Date.now()}`;
    const worker = new Worker(workerUrl);

    worker.onmessage = (
      event: MessageEvent<{ type: string; payload?: VersionInfo }>
    ) => {
      const { type, payload } = event.data;
      if (type === "update" && payload) onUpdate(payload);
    };

    worker.onerror = (error) =>
      console.error("[VersionCheck] Worker 错误:", error);

    worker.postMessage({ type: "init" });

    return () => worker.terminate();
  }, [onUpdate]);

  return <>{children}</>;
};

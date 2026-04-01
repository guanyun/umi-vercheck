import React from "react";
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
export declare const VersionCheck: React.FC<VersionCheckProps>;

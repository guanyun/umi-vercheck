import React from "react";
export interface VersionCheckProps {
    onUpdate: (versionInfo: VersionInfo) => void;
    children?: React.ReactNode;
}
export interface VersionInfo {
    version: string;
    forceUpdate: boolean;
}
export declare const VersionCheck: React.FC<VersionCheckProps>;

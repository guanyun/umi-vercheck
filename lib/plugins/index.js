"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function default_1(api) {
    api.describe({
        key: "versionCheck",
        config: {
            schema(joi) {
                return joi.object({
                    enabled: joi.boolean().default(true),
                    checkInterval: joi.number().default(60000),
                });
            },
        },
    });
    api.onBuildComplete(() => {
        const config = api.userConfig.versionCheck || {};
        if (!config.enabled)
            return;
        const outputDir = api.paths.absOutputPath;
        const checkInterval = config.checkInterval || 60000;
        const { "force-update": forceUpdate = false } = api.args || {};
        const templatePath = path.join(__dirname, "../template/versionCheck.worker.tpl");
        let templateContent;
        try {
            templateContent = fs.readFileSync(templatePath, "utf-8");
        }
        catch (error) {
            api.logger.error(`❌ 读取模板文件失败: ${templatePath}`, error);
            return;
        }
        const workerCode = templateContent.replace(/\{\{checkInterval\}\}/g, String(checkInterval));
        const workerFilePath = path.join(outputDir, "versionCheck.worker.js");
        fs.writeFileSync(workerFilePath, workerCode, "utf-8");
        const versionFilePath = path.join(outputDir, "version.json");
        fs.writeFileSync(versionFilePath, JSON.stringify({ version: Date.now(), forceUpdate: !!forceUpdate }, null, 2), "utf-8");
        if (forceUpdate)
            api.logger.info("✅ 版本强制刷新");
        api.logger.info(`✅ Worker 文件已生成: ${workerFilePath}`);
        api.logger.info(`✅ 版本文件已生成: ${versionFilePath}`);
    });
}

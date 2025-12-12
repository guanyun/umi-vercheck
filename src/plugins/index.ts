import { IApi } from "umi";
import * as fs from "fs";
import * as path from "path";

export default function (api: IApi) {
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
    if (!config.enabled) return;

    const outputDir = api.paths.absOutputPath;
    const checkInterval = config.checkInterval || 60000;
    const { "force-update": forceUpdate = false } = api.args || {};

    const templatePath = path.join(
      __dirname,
      "../template/versionCheck.worker.tpl"
    );

    let templateContent;
    try {
      templateContent = fs.readFileSync(templatePath, "utf-8");
    } catch (error) {
      api.logger.error(`❌ 读取模板文件失败: ${templatePath}`, error);
      return;
    }

    const workerCode = templateContent.replace(
      /\{\{checkInterval\}\}/g,
      String(checkInterval)
    );

    const workerFilePath = path.join(outputDir, "versionCheck.worker.js");
    fs.writeFileSync(workerFilePath, workerCode, "utf-8");

    const versionFilePath = path.join(outputDir, "version.json");
    fs.writeFileSync(
      versionFilePath,
      JSON.stringify(
        { version: Date.now(), forceUpdate: !!forceUpdate },
        null,
        2
      ),
      "utf-8"
    );

    if (forceUpdate) api.logger.info("✅ 版本强制刷新");
    api.logger.info(`✅ Worker 文件已生成: ${workerFilePath}`);
    api.logger.info(`✅ 版本文件已生成: ${versionFilePath}`);
  });
}

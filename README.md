# umi-vercheck

一个用于 UmiJS 的版本检查插件，当应用部署新版本后，自动检测并提示用户刷新页面。

## 特性

- ✅ 自动检测应用版本更新
- ✅ 使用 Web Worker 进行后台检测，不阻塞主线程
- ✅ 可配置检查间隔时间
- ✅ 支持 TypeScript
- ✅ 轻量级，零依赖（仅 peerDependencies）

## 使用方法

### 1. 在 UmiJS 配置中启用插件

在 `.umirc.ts` 或 `config/config.ts` 中配置：

```typescript
import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["umi-vercheck"],
  versionCheck: {
    enabled: true, // 是否启用版本检查，默认 true
    checkInterval: 60000, // 检查间隔（毫秒），默认 60000 (1分钟)
  },
});
```

### 2. 在应用中使用 VersionCheck 组件

```tsx
import { VersionCheck } from "umi-vercheck";
import { message, Modal } from "antd";

function App() {
  const handleUpdate = (versionInfo: { version: string }) => {
    Modal.confirm({
      title: "检测到新版本",
      content: "应用已更新，是否刷新页面？",
      onOk: () => {
        window.location.reload();
      },
    });
  };

  return (
    <VersionCheck onUpdate={handleUpdate}>{/* 你的应用内容 */}</VersionCheck>
  );
}
```

## API

### VersionCheck 组件

| 属性     | 说明                     | 类型                                 | 默认值 |
| -------- | ------------------------ | ------------------------------------ | ------ |
| onUpdate | 检测到新版本时的回调函数 | `(versionInfo: VersionInfo) => void` | 必填   |
| children | 子组件                   | `React.ReactNode`                    | -      |

### VersionInfo

```typescript
interface VersionInfo {
  version: string;
  forceUpdate: boolean;
}
```

### 插件配置

| 配置项        | 说明             | 类型      | 默认值  |
| ------------- | ---------------- | --------- | ------- |
| enabled       | 是否启用版本检查 | `boolean` | `true`  |
| checkInterval | 检查间隔（毫秒） | `number`  | `60000` |

## 工作原理

1. 构建时，插件会在输出目录生成 `version.json` 和 `versionCheck.worker.js`
2. `version.json` 包含当前构建的版本号（时间戳）
3. `versionCheck.worker.js` 是一个 Web Worker，定期检查 `version.json` 是否有更新
4. 当检测到版本变化时，会触发 `onUpdate` 回调

## 注意事项

- **插件仅在构建时（`umi build`）生成版本检查文件**，开发环境（`umi dev`）不会生成
- 确保你的服务器正确配置了静态资源缓存策略
- `version.json` 应该设置为不缓存或短缓存时间

## License

MIT

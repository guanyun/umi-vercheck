(function() {
  'use strict';
  
  let currentVersion = null;
  let checkInterval = {{checkInterval}};
  let versionFile = '/version.json';
  let timer = null;

  async function getVersionInfo() {
    try {
      const response = await fetch(versionFile + '?t=' + Date.now(), {
        method: 'GET',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error('获取版本信息失败: ' + response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[VersionCheck Worker] 获取版本信息失败:', error);
      return null;
    }
  }

  async function checkVersion() {
    const newVersionInfo = await getVersionInfo();
    if (!newVersionInfo) {
      return;
    }

    const newVersion = newVersionInfo.version;

    if (currentVersion === null) {
      currentVersion = newVersion;
      return;
    }

    if (currentVersion !== newVersion) {
      console.log('[VersionCheck Worker] 检测到新版本:', {
        old: currentVersion,
        new: newVersion,
      });

      self.postMessage({ type: 'update', payload: newVersionInfo });
    }
  }

  function startCheck() {
    checkVersion();
    timer = setInterval(checkVersion, checkInterval);
  }

  self.addEventListener('message', (event) => {
    const { type } = event.data;
    if (type === 'init') {
      startCheck();
    }
  });
})();


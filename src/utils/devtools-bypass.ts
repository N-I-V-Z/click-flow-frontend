// src/utils/devtools-watch.ts

export function detectDevTools() {
  if (!import.meta.env.PROD) return;

  // eslint-disable-next-line no-debugger
  (function () {
    const checkDevTools = () => {
      const devtoolsOpen =
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160;

      if (devtoolsOpen) {
        // eslint-disable-next-line no-debugger
        debugger;
      }
    };

    setInterval(checkDevTools, 500);
  })();
}

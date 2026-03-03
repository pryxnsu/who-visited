(() => {
  const resolveScriptTag = () => {
    if (document.currentScript && document.currentScript.getAttribute) {
      return document.currentScript;
    }

    const scripts = document.querySelectorAll('script[src]');

    for (const i = scripts.length - 1; i >= 0; i -= 1) {
      const candidate = scripts[i];
      const src = candidate.getAttribute('src') || '';
      if (src.indexOf('/tracker.js') !== -1 && candidate.getAttribute('data-site-id')) {
        return candidate;
      }
    }

    return null;
  };

  const getPlatform = () => {
    if (navigator.userAgentData?.platform) {
      return navigator.userAgentData.platform;
    }

    const ua = navigator.userAgent;

    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'Mac';
    if (ua.includes('Linux')) return 'Linux';

    return 'unknown';
  };

  try {
    const script = resolveScriptTag();
    if (!script) {
      console.warn('Who Visited: tracker script tag not found');
      return;
    }

    const siteId = script.getAttribute('data-site-id');
    if (!siteId) {
      console.warn('Who Visited: Missing data-site-id');
      return;
    }

    const debug = script.hasAttribute('data-debug');

    const explicitBase = script.getAttribute('data-api-base');

    const baseOrigin = explicitBase
      ? explicitBase.replace(/\/$/, '')
      : new URL(script.src, window.location.href).origin;

    const trackUrl = baseOrigin + '/api/track';
    const payload = {
      siteId,
      path: window.location.pathname,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: getPlatform(),
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      timestamp: new Date().toISOString(),
    };

    if (debug) {
      console.log('Who Visited tracking payload:', payload);
      console.log('Who Visited tracking URL:', trackUrl);
    }

    const body = JSON.stringify(payload);
    let sent = false;

    if (navigator.sendBeacon) {
      const beaconBlob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      sent = navigator.sendBeacon(trackUrl, beaconBlob);
    }

    if (!sent) {
      fetch(trackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: body,
        mode: 'cors',
        keepalive: true,
      }).catch(err => {
        if (debug) {
          console.warn('Who Visited tracker fetch failed:', err);
        }
      });
    }
  } catch (err) {
    console.warn('Who Visited tracker error:', err);
  }
})();

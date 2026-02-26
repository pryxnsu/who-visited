export function getSnippet(siteId: string) {
  return [
    '<script>',
    `  fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://YOUR-APP.com'}/api/track', {`,
    "    method: 'POST',",
    "    headers: { 'Content-Type': 'application/json' },",
    '    body: JSON.stringify({',
    `      siteId: '${siteId}',`,
    '      path: window.location.pathname,',
    "      referrer: document.referrer || 'Direct',",
    '      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone',
    '    })',
    '  });',
    '</script>',
  ].join('\n');
}

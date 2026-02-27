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

export function getRelativeTime(isoTimestamp: string) {
  const timestamp = new Date(isoTimestamp).getTime();
  if (Number.isNaN(timestamp)) return 'Unknown time';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatShare(value: number) {
  return `${Math.round(value * 100)}%`;
}

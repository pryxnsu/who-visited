export function getSnippet(siteId: string) {
  const src =
    typeof window !== "undefined"
      ? `${window.location.origin}/tracker.js`
      : "https://whovisited.priyanshu.me/tracker.js";

  return [
    `<Script`,
    `  src="${src}"`,
    `  data-site-id="${siteId}"`,
    `  strategy="afterInteractive"`,
    `/>`,
  ].join("\n");
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

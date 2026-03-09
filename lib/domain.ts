export function normalizeDomain(input: string) {
  const value = input.trim().toLowerCase();

  const withoutProtocol = value.replace(/^https?:\/\//, '');
  const withoutPath = withoutProtocol.split('/')[0] ?? withoutProtocol;
  const withoutPort = withoutPath.split(':')[0] ?? withoutPath;
  const withoutWildcard = withoutPort.replace(/^\*\./, '');

  return withoutWildcard.replace(/\.$/, '');
}

function stripWwwSubdomain(host: string) {
  return host.startsWith('www.') ? host.slice(4) : host;
}

export function isEquivalentSiteHost(hostA: string, hostB: string) {
  const normalizedA = normalizeDomain(hostA);
  const normalizedB = normalizeDomain(hostB);

  if (!normalizedA || !normalizedB) return false;
  if (normalizedA === normalizedB) return true;

  return stripWwwSubdomain(normalizedA) === stripWwwSubdomain(normalizedB);
}

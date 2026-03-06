export function normalizeDomain(input: string) {
  const value = input.trim().toLowerCase();

  const withoutProtocol = value.replace(/^https?:\/\//, '');
  const withoutPath = withoutProtocol.split('/')[0] ?? withoutProtocol;
  const withoutPort = withoutPath.split(':')[0] ?? withoutPath;
  const withoutWildcard = withoutPort.replace(/^\*\./, '');

  return withoutWildcard.replace(/\.$/, '');
}

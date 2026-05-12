export function createAuditMetadata(source: string, details: Record<string, unknown>) {
  return {
    source,
    ...details,
    capturedAt: new Date().toISOString(),
  };
}

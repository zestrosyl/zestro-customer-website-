export interface ParsedTableQr {
  tableId: string;
  tableNumber: string;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

function normalizeTableToken(rawToken: string): ParsedTableQr | null {
  const trimmed = rawToken.trim();
  if (!trimmed) return null;

  const withoutPrefix = trimmed.replace(/^table[-_\s]*/i, '');
  if (!withoutPrefix || !VALID_ID_REGEX.test(withoutPrefix)) {
    return null;
  }

  const paddedNumber = /^\d+$/.test(withoutPrefix)
    ? withoutPrefix.padStart(2, '0')
    : withoutPrefix;

  const candidateId = `table-${paddedNumber}`;
  if (!VALID_ID_REGEX.test(candidateId)) {
    return null;
  }

  return {
    tableId: candidateId,
    tableNumber: paddedNumber,
  };
}

/**
 * Parses table-specific QR payloads from Zestro table QR codes or manual table input:
 * - Full URLs: https://.../?table=04 or https://.../?table=table-04
 * - Relative URLs / query strings: /?table=04, ?table=04, table=04
 * - Path segments: /table/04 or /tables/table-04
 * - JSON strings: {"tableId":"table-04","tableNumber":"04"} or {"table":"04"}
 * - Direct table IDs or numbers: table-04, 04, 4
 */
export function parseTableQrPayload(rawValue: string): ParsedTableQr | null {
  const input = rawValue.trim();
  if (!input || input.length > 512) return null;

  // 1. Try JSON payload
  if (input.startsWith('{') && input.endsWith('}')) {
    try {
      const obj = JSON.parse(input) as {
        tableId?: unknown;
        tableNumber?: unknown;
        table?: unknown;
      };
      const candidate =
        typeof obj.tableId === 'string' && obj.tableId.trim()
          ? obj.tableId
          : typeof obj.tableNumber === 'string' && obj.tableNumber.trim()
          ? obj.tableNumber
          : typeof obj.table === 'string' && obj.table.trim()
          ? obj.table
          : null;
      if (candidate) {
        return normalizeTableToken(candidate);
      }
    } catch {
      // Ignore malformed JSON and continue to URL/token parsing
    }
  }

  // 2. Try URL / query parameter (?table=...)
  if (input.includes('table=') || /^https?:\/\//i.test(input) || input.startsWith('/')) {
    try {
      const parsedUrl = new URL(
        input.startsWith('http://') || input.startsWith('https://')
          ? input
          : `https://zestro.local${input.startsWith('/') ? '' : '/'}${input}`
      );
      const queryTable =
        parsedUrl.searchParams.get('table') ||
        parsedUrl.searchParams.get('tableId') ||
        parsedUrl.searchParams.get('t');
      if (queryTable) {
        return normalizeTableToken(queryTable);
      }

      const pathMatch = parsedUrl.pathname.match(/\/tables?\/([^/]+)\/?$/i);
      if (pathMatch?.[1]) {
        return normalizeTableToken(decodeURIComponent(pathMatch[1]));
      }
    } catch {
      // Fall through to regex/token extraction
    }
  }

  // 3. Extract ?table= or table= manually if needed
  const queryFallback = input.match(/(?:^|[?&])(?:table|tableId)=([^&\s]+)/i);
  if (queryFallback?.[1]) {
    try {
      return normalizeTableToken(decodeURIComponent(queryFallback[1]));
    } catch {
      return normalizeTableToken(queryFallback[1]);
    }
  }

  // 4. Reject arbitrary non-Zestro URLs that had no table parameter
  if (/^https?:\/\//i.test(input)) {
    return null;
  }

  // 5. Direct table ID or table number (e.g. "table-04", "04", "4")
  return normalizeTableToken(input);
}

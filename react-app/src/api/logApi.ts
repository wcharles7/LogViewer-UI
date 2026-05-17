const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export interface LogEntry {
  logEntryId:     number;
  timestamp:      string;
  levelName:      string;
  source:         string | null;
  message:        string;
  exception:      string | null;
  metadata:       string | null;
  eventId:        number | null;
  correlationId:  string | null;
  userId:         string | null;
  requestPath:    string | null;
  httpMethod:     string | null;
  statusCode:     number | null;
  durationMs:     number | null;
  ipAddress:      string | null;
  machineName:    string | null;
  environment:    string | null;
  applicationName:string | null;
}

export interface LogPagedResponse {
  total:    number;
  page:     number;
  pageSize: number;
  pages:    number;
  data:     LogEntry[];
}

export interface LogStats {
  errorCount:   number;
  warningCount: number;
  infoCount:    number;
  totalCount:   number;
  sources:      string[];
  last24h:      { hour: string; errors: number; warnings: number }[];
}

export interface LogQuery {
  levelName?:     string;
  source?:        string;
  correlationId?: string;
  userId?:        string;
  search?:        string;
  statusCode?:    number;
  httpMethod?:    string;
  dateFrom?:      string;
  dateTo?:        string;
  page?:          number;
  pageSize?:      number;
}

function buildQuery(params: LogQuery): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  return q.toString();
}

export async function getLogs(query: LogQuery): Promise<LogPagedResponse> {
  const res = await fetch(`${BASE_URL}/logs/get?${buildQuery(query)}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function getLogById(id: number): Promise<LogEntry> {
  const res = await fetch(`${BASE_URL}/logs/get/${id}`);
  if (!res.ok) throw new Error('Log not found');
  return res.json();
}

export async function getStats(): Promise<LogStats> {
  const res = await fetch(`${BASE_URL}/logs/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getSources(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/logs/sources`);
  if (!res.ok) throw new Error('Failed to fetch sources');
  return res.json();
}

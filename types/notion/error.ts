export interface NotionErrorResponse {
  object: 'error';
  status: number;
  code: string;
  message: string;
}

export type NotionErrorCode =
  | 'invalid_json'
  | 'invalid_request_url'
  | 'invalid_request'
  | 'validation_error'
  | 'missing_version'
  | 'unauthorized'
  | 'restricted_resource'
  | 'object_not_found'
  | 'conflict_error'
  | 'rate_limited'
  | 'internal_server_error'
  | 'service_unavailable'
  | 'database_connection_unavailable'
  | 'gateway_timeout';

export class NotionAPIError extends Error {
  constructor(
    public code: NotionErrorCode,
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'NotionAPIError';
  }
}

type reponse = {
  statusCode: number;
  message: string;
  count?: number;
  data: any;
  timestamp: string;
}
export function buildResponse<T>(
  statusCode: number = 200,
  message: string = 'Success',
  data: T,
): any {
  return {
    statusCode,
    message,
    count: Array.isArray(data) ? data.length : undefined,
    data,
    timestamp: new Date().toISOString(),
  };
}

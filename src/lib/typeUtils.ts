
export interface GenericStringError {
  error: true;
  message: string;
}

export function isError<T>(obj: T | GenericStringError): obj is GenericStringError {
  return typeof obj === 'object' && obj !== null && 'error' in obj && (obj as GenericStringError).error === true;
}

export function isNotError<T>(obj: T | GenericStringError): obj is T {
  return !isError(obj);
}

export function filterValidData<T>(data: (T | GenericStringError)[]): T[] {
  return data.filter(isNotError);
}

export function hasErrors<T>(data: (T | GenericStringError)[]): boolean {
  return data.some(isError);
}

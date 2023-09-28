import { Context } from './context.interface';

export interface ExceptionHandler {
  handle(error: Error, context?: Context): Promise<void>;
}

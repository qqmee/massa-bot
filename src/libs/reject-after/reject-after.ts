import { RejectAfterException } from './reject-after.exception';

export async function rejectAfter(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new RejectAfterException());
    }, ms);
  });
}

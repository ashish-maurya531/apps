import { isValidHttpUrl } from '../../lib/links';
import useDebounceFn, { CancelEvent, StartFn } from '../useDebounceFn';

export const useDebouncedUrl = (
  callback: StartFn<string>,
  onValidate: StartFn<string, boolean>,
  delay = 1000,
): [StartFn<string>, CancelEvent] =>
  useDebounceFn((value: string) => {
    if (!isValidHttpUrl(value) || !onValidate(value)) {
      return null;
    }

    return callback(value);
  }, delay);

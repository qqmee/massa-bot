import { validateOrReject } from 'class-validator';

export abstract class AbstractValidator {
  public load(values: Record<string, unknown>) {
    for (const key in values) {
      this[key] = values[key];
    }

    return this;
  }

  public validate() {
    return validateOrReject(this, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });
  }
}

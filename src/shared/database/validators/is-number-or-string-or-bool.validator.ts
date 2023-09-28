import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number-or-bool', async: false })
export class IsNumberOrStringOrBool implements ValidatorConstraintInterface {
  validate(text: any) {
    return (
      typeof text === 'number' ||
      typeof text === 'string' ||
      typeof text === 'boolean'
    );
  }

  defaultMessage() {
    return '($value) must be number or string or boolean';
  }
}

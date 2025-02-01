import { ValidatorConstraint, registerDecorator } from 'class-validator';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

export function validatorFactory(validator: (value: any) => boolean) {
  @ValidatorConstraint({ async: true })
  class IsBooleanOrStringConstraint implements ValidatorConstraintInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(value: any, _args: ValidationArguments) {
      return validator.call(this, value);
    }
  }

  return function (validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsBooleanOrStringConstraint,
      });
    };
  };
}

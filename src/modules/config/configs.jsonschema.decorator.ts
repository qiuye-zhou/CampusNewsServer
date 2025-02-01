import { JSONSchema } from 'class-validator-jsonschema';
import type { DecoratorSchema } from 'class-validator-jsonschema/build/decorators';

export const halfFieldOption = {
  'ui:options': { halfGrid: true },
};

export const JSONSchemaPlainField = (title: string, schema?: DecoratorSchema) =>
  JSONSchema({
    title,
    ...schema,
  });

export const JSONSchemaHalfGirdPlainField: typeof JSONSchemaPlainField = (
  ...rest
) => JSONSchemaPlainField.call(null, ...rest, halfFieldOption);

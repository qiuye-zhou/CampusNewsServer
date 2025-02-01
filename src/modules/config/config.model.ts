import { Schema } from 'mongoose';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW, customName: 'ConfigOption' },
  schemaOptions: {
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  },
})
export class ConfigOptionModel {
  @prop({ unique: true, required: true })
  name: string;

  @prop({ type: Schema.Types.Mixed })
  value: any;
}

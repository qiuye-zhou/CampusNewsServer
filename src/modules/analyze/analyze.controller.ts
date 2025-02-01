import { Controller } from '@nestjs/common';

import { Auth } from '~/common/decorator/auth.decorator';

@Controller('analyze')
@Auth()
export class AnalyzeController {
  constructor() {}
}

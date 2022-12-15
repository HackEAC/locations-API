import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {

  @Get()
  getHealth() {
    return 'Health Checked!'
  }

}

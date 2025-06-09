import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags()
@Controller()
export class AuthController {
  constructor() { }

  @Get('health')
  getHealth(): string {
    return 'OK';
  }
}

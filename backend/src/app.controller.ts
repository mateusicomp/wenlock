import { Controller, Get } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController() 
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: "Welcome to WENLOCK API",
      swagger: "/api",
      endpoints: {
        users: "/users",
      },
    };
  }
}

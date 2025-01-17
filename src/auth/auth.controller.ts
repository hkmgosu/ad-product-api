import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login via username and password',
    description:
      'Login via username and password using JWT logic, gives a token and the username',
  })
  @ApiBody({
    type: LoginDto,
    description: 'The Description for the Post Body. Please look into the DTO',
    examples: {
      a: {
        summary: 'Empty Body',
        description: 'Description for when an empty body is used',
        value: {} as LoginDto,
      },
      b: {
        summary: 'Username and Password example',
        description: 'Example user for login',
        value: { username: 'maria', password: 'guess' } as LoginDto,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The USER has logged successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() input: LoginDto) {
    if (!input.username || !input.password)
      throw new BadRequestException(
        'Need to provide Username and Password for the Login',
      );
    return this.authService.signIn(input);
  }
}

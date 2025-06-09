import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ip = ctx.getRequest<Request>().ip;
    const status = exception.getStatus();
    const msg: any = exception.getResponse();

    if (typeof msg === 'object') response.status(status).json({ statusCode: status, message: msg.message, path: request.url, from: ip })
    else response.status(status).json({ statusCode: status, message: msg.split(' for ')[0], path: request.url, from: ip });
  }
}
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' }),
    ApiResponse({ status: 401, description: 'Unauthorized. Authentication is required.' }),
    ApiResponse({ status: 404, description: 'Resource not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );
}

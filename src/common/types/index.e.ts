import { HttpStatus } from '@nestjs/common';

import { User } from '@/modules/users/entities/user.entity';
3;

export type ResetPeriod = 'yearly' | 'monthly' | 'weekly';

export type RequestWithUser = Request & { user: User };

export type TokenPayload = {
  userId: string;
  tokenType: number;
  exp: number;
  iat: number;
};

export type TEntityError = {
  field: string;
  message: string;
};

export type TApiError<T> = {
  message: string;
  statusCode: HttpStatus;
  data?: T;
  errors?: TEntityError[];
};

export type TApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  pagination?: TPagination;
};

export type TPagination = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type TValidationErrorResponse = {
  message: string[];
  error: string;
};

export interface IEmailContext {
  name: string;
  email?: string;
  password?: string;
  resetPasswordLink?: string;
  updatePasswordLink?: string;
}

export interface IEmailResetPasswordCompleteContext {
  clientLoginUrl: string;
}

export interface IRequestNotificationEmailInfo {
  approverName: string;
  approverEmail: string;
  employeeName: string;
  email: string;
  startTime: Date | string;
  endTime: Date | string;
  reason: string;
  type: string;
  status?: string;
}

export type TLanguage = 'en' | 'vi' | 'ja';

export interface IBaseTimeConfig {
  requestStartTime: Date;
  requestEndTime: Date;
  requestStartUtcTime: string;
  requestEndUtcTime: string;
  startWorkTime: string;
  endWorkTime: string;
  userId: string;
  user: User;
}

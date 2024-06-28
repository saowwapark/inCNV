import express from 'express';
export class ResponseDto<T> {
  statusCode?: number;
  statusMessage?: string;
  data?: T;

  constructor();
  constructor(statusCode: number, statusMessage: string, data: T);
  constructor(statusCode?: number, statusMessage?: string, data?: T) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.data = data;
  }
  sendResponse(res: express.Response) {
    this.statusCode ? (res.statusCode = this.statusCode) : null;
    this.statusMessage ? (res.statusMessage = this.statusMessage) : null;
    res.json(this.data);
  }
}

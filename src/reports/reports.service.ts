import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  getReport() {
    // Your custom report logic here
    return { message: 'This is a report' };
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ApplicationItem {
  id: number;
  name: string;
  server: string;
  status: string;
  lastCheck: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applications: ApplicationItem[] = [
    {
      id: 1,
      name: 'Core Banking',
      server: 'SRV-APP-01',
      status: 'ONLINE',
      lastCheck: '10/04/2026 10:00'
    },
    {
      id: 2,
      name: 'Payment Gateway',
      server: 'SRV-PAY-01',
      status: 'CRITICAL',
      lastCheck: '10/04/2026 10:05'
    }
  ];

  getAllApplications(): Observable<ApplicationItem[]> {
    return of(this.applications);
  }
}
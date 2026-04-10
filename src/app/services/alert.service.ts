import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AlertItem {
  id: number;
  server: string;
  severity: string;
  subject: string;
  message: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts: AlertItem[] = [
    {
      id: 1,
      server: 'SRV-PAY-01',
      severity: 'Critical',
      subject: 'Serveur indisponible',
      message: 'Le serveur de paiement est tombé en panne.',
      time: '10/04/2026 10:15'
    },
    {
      id: 2,
      server: 'SRV-DB-01',
      severity: 'Warning',
      subject: 'RAM élevée',
      message: 'La RAM du serveur dépasse le seuil.',
      time: '10/04/2026 10:20'
    }
  ];

  getAllAlerts(): Observable<AlertItem[]> {
    return of(this.alerts);
  }

  addAlert(alert: AlertItem): Observable<AlertItem> {
    this.alerts.unshift(alert);
    return of(alert);
  }
}
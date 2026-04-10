import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ServerItem {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  systeme: string;
  status: string;
  lastCheck: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private servers: ServerItem[] = [
    {
      id: 1,
      name: 'SRV-APP-01',
      ipAddress: '192.168.1.10',
      port: 8080,
      systeme: 'Linux',
      status: 'ONLINE',
      lastCheck: '10/04/2026 09:30'
    },
    {
      id: 2,
      name: 'SRV-DB-01',
      ipAddress: '192.168.1.20',
      port: 3306,
      systeme: 'Windows Server',
      status: 'WARNING',
      lastCheck: '10/04/2026 09:35'
    },
    {
      id: 3,
      name: 'SRV-PAY-01',
      ipAddress: '192.168.1.30',
      port: 9000,
      systeme: 'Linux',
      status: 'CRITICAL',
      lastCheck: '10/04/2026 09:40'
    }
  ];

  getAllServers(): Observable<ServerItem[]> {
    return of(this.servers);
  }

  getServerById(id: number): Observable<ServerItem | undefined> {
    return of(this.servers.find(server => server.id === id));
  }

  addServer(server: ServerItem): Observable<ServerItem> {
    this.servers.push(server);
    return of(server);
  }

  deleteServer(id: number): Observable<boolean> {
    this.servers = this.servers.filter(server => server.id !== id);
    return of(true);
  }
}
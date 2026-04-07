import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface ServerHistoryItem {
  day: string;
  date: string;
  cpu: number;
  ram: number;
  storage: number;
  availability: number;
  alerts: number;
  dominantIssue: string;
}

interface DailyServerIssue {
  id: number;
  dayNumber: number;
  date: string;
  server: string;
  service: string;
  time: string;
  duration: string;
  status: 'Résolu' | 'Alerte' | 'Critique';
  description: string;
  impact: string;
}

interface CalendarCell {
  dayNumber: number | null;
}

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-history.html',
  styleUrls: ['./user-history.css']
})
export class UserHistory implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  userName = 'Utilisateur';
  showProfileCard = false;

  monthLabel = 'Mars 2026';
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  selectedDayNumber = 14;

  serverHistory: ServerHistoryItem[] = [
    {
      day: 'Lun',
      date: '10/03/2026',
      cpu: 48,
      ram: 59,
      storage: 64,
      availability: 99,
      alerts: 1,
      dominantIssue: 'Surcharge mémoire légère'
    },
    {
      day: 'Mar',
      date: '11/03/2026',
      cpu: 54,
      ram: 63,
      storage: 65,
      availability: 98,
      alerts: 1,
      dominantIssue: 'Pic CPU sur SRV-02'
    },
    {
      day: 'Mer',
      date: '12/03/2026',
      cpu: 71,
      ram: 78,
      storage: 67,
      availability: 94,
      alerts: 3,
      dominantIssue: 'Redémarrage service API'
    },
    {
      day: 'Jeu',
      date: '13/03/2026',
      cpu: 58,
      ram: 61,
      storage: 67,
      availability: 97,
      alerts: 1,
      dominantIssue: 'Temps de réponse élevé'
    },
    {
      day: 'Ven',
      date: '14/03/2026',
      cpu: 82,
      ram: 86,
      storage: 69,
      availability: 91,
      alerts: 4,
      dominantIssue: 'Saturation RAM + file jobs'
    },
    {
      day: 'Sam',
      date: '15/03/2026',
      cpu: 45,
      ram: 53,
      storage: 68,
      availability: 99,
      alerts: 0,
      dominantIssue: 'Aucune anomalie critique'
    },
    {
      day: 'Dim',
      date: '16/03/2026',
      cpu: 39,
      ram: 47,
      storage: 68,
      availability: 100,
      alerts: 0,
      dominantIssue: 'Fonctionnement stable'
    }
  ];

  dailyIssues: DailyServerIssue[] = [
    {
      id: 1,
      dayNumber: 11,
      date: '11/03/2026',
      server: 'SRV-01',
      service: 'Core Banking',
      time: '15:30',
      duration: '22 min',
      status: 'Résolu',
      description: 'Temps de réponse élevé lié à une saturation temporaire de la file de transactions.',
      impact: 'Ralentissement ponctuel des opérations bancaires.'
    },
    {
      id: 2,
      dayNumber: 12,
      date: '12/03/2026',
      server: 'SRV-02',
      service: 'Customer Portal',
      time: '10:42',
      duration: '36 min',
      status: 'Résolu',
      description: 'Pic CPU causé par une requête SQL non optimisée et montée soudaine du trafic.',
      impact: 'Lenteur visible côté portail client.'
    },
    {
      id: 3,
      dayNumber: 12,
      date: '12/03/2026',
      server: 'SRV-05',
      service: 'Authentication API',
      time: '11:07',
      duration: '18 min',
      status: 'Alerte',
      description: 'Instabilité applicative après redémarrage automatique du service d’authentification.',
      impact: 'Connexions intermittentes pour plusieurs utilisateurs.'
    },
    {
      id: 4,
      dayNumber: 13,
      date: '13/03/2026',
      server: 'SRV-04',
      service: 'Reporting Suite',
      time: '18:20',
      duration: '45 min',
      status: 'Alerte',
      description: 'Maintenance prolongée après mise à jour des dépendances applicatives.',
      impact: 'Rapports retardés pour les utilisateurs internes.'
    },
    {
      id: 5,
      dayNumber: 14,
      date: '14/03/2026',
      server: 'SRV-06',
      service: 'Mobile API',
      time: '08:15',
      duration: '49 min',
      status: 'Critique',
      description: 'Consommation RAM excessive après exécution batch et fuite mémoire sur worker.',
      impact: 'API mobile indisponible partiellement.'
    },
    {
      id: 6,
      dayNumber: 14,
      date: '14/03/2026',
      server: 'SRV-03',
      service: 'Batch Processor',
      time: '08:32',
      duration: '31 min',
      status: 'Critique',
      description: 'Blocage de la file jobs et saturation du traitement batch du matin.',
      impact: 'Retard de traitement et alertes en cascade.'
    },
    {
      id: 7,
      dayNumber: 14,
      date: '14/03/2026',
      server: 'SRV-08',
      service: 'Notifications Service',
      time: '09:10',
      duration: '12 min',
      status: 'Alerte',
      description: 'Service lent suite à une montée soudaine du trafic et de la consommation CPU.',
      impact: 'Notifications retardées pour une partie des clients.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const currentUser =
      JSON.parse(localStorage.getItem('currentUser') || 'null') ||
      JSON.parse(sessionStorage.getItem('currentUser') || 'null');

    this.userName = currentUser?.name || 'Utilisateur';
  }

  get summaryCards() {
    const avgCpu = Math.round(
      this.serverHistory.reduce((sum, item) => sum + item.cpu, 0) / this.serverHistory.length
    );

    const avgRam = Math.round(
      this.serverHistory.reduce((sum, item) => sum + item.ram, 0) / this.serverHistory.length
    );

    const avgAvailability = Math.round(
      this.serverHistory.reduce((sum, item) => sum + item.availability, 0) / this.serverHistory.length
    );

    const totalAlerts = this.serverHistory.reduce((sum, item) => sum + item.alerts, 0);

    return [
      { label: 'CPU moyen', value: `${avgCpu}%`, note: 'Charge hebdomadaire', tone: 'blue' },
      { label: 'RAM moyenne', value: `${avgRam}%`, note: 'Utilisation mémoire', tone: 'purple' },
      { label: 'Disponibilité', value: `${avgAvailability}%`, note: 'Uptime global', tone: 'green' },
      { label: 'Alertes', value: `${totalAlerts}`, note: 'Incidents détectés', tone: 'red' }
    ];
  }

  get maxLoadValue(): number {
    return Math.max(...this.serverHistory.map(item => Math.max(item.cpu, item.ram, item.storage)), 100);
  }

  get calendarCells(): CalendarCell[] {
    const cells: CalendarCell[] = [];
    const firstDayOffset = 6;
    const daysInMonth = 31;

    for (let i = 0; i < firstDayOffset; i++) {
      cells.push({ dayNumber: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ dayNumber: day });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ dayNumber: null });
    }

    return cells;
  }

  get selectedDateLabel(): string {
    return `${String(this.selectedDayNumber).padStart(2, '0')}/03/2026`;
  }

  get selectedDayIssues(): DailyServerIssue[] {
    return this.dailyIssues.filter(item => item.dayNumber === this.selectedDayNumber);
  }

  get selectedDayHistory(): ServerHistoryItem | undefined {
    return this.serverHistory.find(item => this.extractDayNumber(item.date) === this.selectedDayNumber);
  }

  get selectedDayAvailability(): number {
    return this.selectedDayHistory?.availability ?? 100;
  }

  get selectedDayAlerts(): number {
    return this.selectedDayHistory?.alerts ?? 0;
  }

  get selectedDayIssueLabel(): string {
    return this.selectedDayHistory?.dominantIssue ?? 'Aucune anomalie critique';
  }

  get selectedDayGauge(): string {
    const value = this.selectedDayAvailability;
    return `conic-gradient(#2f80ff 0% ${value}%, rgba(255,255,255,.08) ${value}% 100%)`;
  }

  selectDay(dayNumber: number | null): void {
    if (!dayNumber) return;
    this.selectedDayNumber = dayNumber;
  }

  hasIssue(dayNumber: number | null): boolean {
    if (!dayNumber) return false;
    return this.dailyIssues.some(item => item.dayNumber === dayNumber);
  }

  extractDayNumber(dateValue: string): number {
    return Number(dateValue.split('/')[0]);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Critique':
        return 'critical';
      case 'Alerte':
        return 'watch';
      default:
        return 'resolved';
    }
  }

  logout(): void {
    this.showProfileCard = false;
    if (!this.isBrowser) return;

    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  toggleProfileCard(event: MouseEvent): void {
    event.stopPropagation();
    this.showProfileCard = !this.showProfileCard;
  }

  closeProfileCard(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showProfileCard = false;
  }
}
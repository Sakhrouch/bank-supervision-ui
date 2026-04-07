import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ServerItem {
  name: string;
  ip: string;
  port: string;
  os: string;
  status: 'En ligne' | 'Avertissement' | 'Hors ligne' | 'Maintenance';
  lastCheck: string;
  location: string;
  owner: string;
  description: string;
  cpu: number;
  ram: number;
  storage: number;
  uptime: string;
}

interface SummaryItem {
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'yellow' | 'purple';
}

@Component({
  selector: 'app-servers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servers.html',
  styleUrls: ['./servers.css']
})
export class Servers {
  searchTerm = '';
  showAdd = false;
  showProfileCard = false;
  showEditStatus = false;
  availableStatuses: ('En ligne' | 'Avertissement' | 'Hors ligne' | 'Maintenance')[] = [
    'En ligne',
    'Avertissement',
    'Hors ligne',
    'Maintenance'
  ];

  currentPage = 1;
  pageSize = 10;

  currentUser = {
    fullName: 'Administrateur',
    username: 'admin1',
    role: 'Administrateur',
    email: 'admin@bct.local',
    status: 'Connecté',
    image: 'assets/profil.png'
  };

  servers: ServerItem[] = [
    {
      name: 'SRV-01',
      ip: '192.168.1.10',
      port: '22',
      os: 'Linux',
      status: 'En ligne',
      lastCheck: '10:00',
      location: 'Salle serveur A',
      owner: 'Équipe Infrastructure',
      description: 'Serveur principal de supervision.',
      cpu: 42,
      ram: 56,
      storage: 61,
      uptime: '12 j 04 h 15 min'
    },
    {
      name: 'SRV-02',
      ip: '192.168.1.11',
      port: '80',
      os: 'Ubuntu',
      status: 'Avertissement',
      lastCheck: '09:20',
      location: 'Salle serveur B',
      owner: 'Équipe Réseau',
      description: 'Serveur applicatif avec charge modérée.',
      cpu: 71,
      ram: 66,
      storage: 58,
      uptime: '8 j 10 h 22 min'
    },
    {
      name: 'SRV-03',
      ip: '192.168.1.12',
      port: '22',
      os: 'Windows',
      status: 'Hors ligne',
      lastCheck: '08:45',
      location: 'Site secondaire',
      owner: 'Équipe Système',
      description: 'Serveur momentanément indisponible.',
      cpu: 12,
      ram: 18,
      storage: 47,
      uptime: '0 j 00 h 00 min'
    },
    {
      name: 'SRV-04',
      ip: '192.168.1.13',
      port: '21',
      os: 'Debian',
      status: 'Maintenance',
      lastCheck: '11:10',
      location: 'Salle technique 2',
      owner: 'Équipe Maintenance',
      description: 'Serveur en maintenance programmée.',
      cpu: 25,
      ram: 31,
      storage: 44,
      uptime: '3 j 02 h 40 min'
    },
    {
      name: 'SRV-05',
      ip: '192.168.1.14',
      port: '22',
      os: 'Linux',
      status: 'En ligne',
      lastCheck: '12:00',
      location: 'Salle serveur A',
      owner: 'Équipe Infrastructure',
      description: 'Serveur dédié aux sauvegardes.',
      cpu: 39,
      ram: 48,
      storage: 73,
      uptime: '21 j 06 h 51 min'
    },
    {
      name: 'SRV-06',
      ip: '192.168.1.15',
      port: '443',
      os: 'Ubuntu',
      status: 'Avertissement',
      lastCheck: '12:15',
      location: 'Datacenter principal',
      owner: 'Équipe Sécurité',
      description: 'Serveur frontal avec surveillance renforcée.',
      cpu: 77,
      ram: 69,
      storage: 64,
      uptime: '14 j 03 h 11 min'
    },
    {
      name: 'SRV-07',
      ip: '192.168.1.16',
      port: '22',
      os: 'CentOS',
      status: 'En ligne',
      lastCheck: '12:40',
      location: 'Datacenter principal',
      owner: 'Équipe Système',
      description: 'Serveur de calcul interne.',
      cpu: 36,
      ram: 41,
      storage: 52,
      uptime: '18 j 09 h 05 min'
    },
    {
      name: 'SRV-08',
      ip: '192.168.1.17',
      port: '8080',
      os: 'Windows',
      status: 'Hors ligne',
      lastCheck: '13:00',
      location: 'Site distant',
      owner: 'Équipe Support',
      description: 'Serveur applicatif en attente de redémarrage.',
      cpu: 8,
      ram: 14,
      storage: 49,
      uptime: '0 j 00 h 00 min'
    },
    {
      name: 'SRV-09',
      ip: '192.168.1.18',
      port: '22',
      os: 'Linux',
      status: 'En ligne',
      lastCheck: '13:20',
      location: 'Salle serveur C',
      owner: 'Équipe Infrastructure',
      description: 'Serveur de traitement interne.',
      cpu: 51,
      ram: 57,
      storage: 62,
      uptime: '11 j 08 h 47 min'
    },
    {
      name: 'SRV-10',
      ip: '192.168.1.19',
      port: '3306',
      os: 'Ubuntu',
      status: 'Avertissement',
      lastCheck: '13:45',
      location: 'Salle base de données',
      owner: 'Équipe Base de données',
      description: 'Serveur de base de données avec forte activité.',
      cpu: 82,
      ram: 76,
      storage: 79,
      uptime: '6 j 12 h 08 min'
    }
  ];

  selectedServer: ServerItem = this.servers[0];

  form = {
    name: '',
    ip: '',
    port: '',
    os: 'Linux',
    location: '',
    owner: '',
    description: ''
  };

  constructor(private router: Router) {}

  get summary(): SummaryItem[] {
    return [
      {
        label: 'TOTAL SERVEURS',
        value: this.servers.length,
        tone: 'blue'
      },
      {
        label: 'EN LIGNE',
        value: this.countByStatus('En ligne'),
        tone: 'green'
      },
      {
        label: 'AVERTISSEMENTS',
        value: this.countByStatus('Avertissement'),
        tone: 'yellow'
      },
      {
        label: 'HORS LIGNE',
        value: this.countByStatus('Hors ligne'),
        tone: 'purple'
      }
    ];
  }

  get filteredServers(): ServerItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.servers;
    }

    return this.servers.filter(server =>
      server.name.toLowerCase().includes(term) ||
      server.ip.toLowerCase().includes(term) ||
      server.port.toLowerCase().includes(term) ||
      server.os.toLowerCase().includes(term) ||
      server.status.toLowerCase().includes(term) ||
      server.location.toLowerCase().includes(term) ||
      server.owner.toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    const total = Math.ceil(this.filteredServers.length / this.pageSize);
    return total > 0 ? total : 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get pagedServers(): ServerItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredServers.slice(start, start + this.pageSize);
  }

  countByStatus(status: ServerItem['status']): number {
    return this.servers.filter(server => server.status === status).length;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  selectServer(server: ServerItem): void {
    this.selectedServer = server;
  }

  editServer(): void {
    this.showEditStatus = true;
  }

  updateServerStatus(newStatus: 'En ligne' | 'Avertissement' | 'Hors ligne' | 'Maintenance'): void {
    this.selectedServer.status = newStatus;
    this.showEditStatus = false;
  }

  closeEditStatus(): void {
    this.showEditStatus = false;
  }

  openAddServer(): void {
    this.showAdd = true;
    this.showProfileCard = false;
  }

  closeAddServer(): void {
    this.showAdd = false;
    this.resetForm();
  }

  addServer(): void {
    if (
      !this.form.name.trim() ||
      !this.form.ip.trim() ||
      !this.form.port.trim() ||
      !this.form.os.trim() ||
      !this.form.location.trim() ||
      !this.form.owner.trim() ||
      !this.form.description.trim()
    ) {
      return;
    }

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const newServer: ServerItem = {
      name: this.form.name.trim(),
      ip: this.form.ip.trim(),
      port: this.form.port.trim(),
      os: this.form.os.trim(),
      status: 'En ligne',
      lastCheck: `${hh}:${mm}`,
      location: this.form.location.trim(),
      owner: this.form.owner.trim(),
      description: this.form.description.trim(),
      cpu: 28,
      ram: 34,
      storage: 40,
      uptime: '0 j 00 h 05 min'
    };

    this.servers = [newServer, ...this.servers];
    this.selectedServer = newServer;
    this.currentPage = 1;
    this.closeAddServer();
  }

  resetForm(): void {
    this.form = {
      name: '',
      ip: '',
      port: '',
      os: 'Linux',
      location: '',
      owner: '',
      description: ''
    };
  }

  statusClass(status: string): string {
    const value = status.toLowerCase();

    if (value === 'en ligne') return 'en-ligne';
    if (value === 'avertissement') return 'alerte';
    if (value === 'hors ligne') return 'arretee';
    if (value === 'maintenance') return 'maintenance';

    return '';
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

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showProfileCard = false;
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    this.showProfileCard = false;
    this.showAdd = false;
    this.showEditStatus = false;
  }

  logout(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showProfileCard = false;
    this.router.navigate(['/login']);
  }
}
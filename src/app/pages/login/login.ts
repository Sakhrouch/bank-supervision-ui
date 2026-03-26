import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  email = '';
  password = '';
  error = '';
  showPassword = false;
  rememberMe = false;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.seedDefaultAccounts();
    this.clearPreviousSession();
  }

  private clearPreviousSession(): void {
    sessionStorage.removeItem('currentUser');
  }

  private seedDefaultAccounts(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const defaultAdmin = {
      id: 1,
      name: 'Admin',
      email: 'admin@bank.com',
      password: '123456',
      role: 'admin'
    };

    const secondAdmin = {
      id: 3,
      name: 'Admin1',
      email: 'admin@banque.tn',
      password: '123456',
      role: 'admin'
    };

    const defaultUser = {
      id: 2,
      name: 'User',
      email: 'user@bank.com',
      password: '1234567',
      role: 'user'
    };

    const cleanedUsers = users.filter(
      (u: any) =>
        u.email !== defaultAdmin.email &&
        u.email !== defaultUser.email &&
        u.email !== secondAdmin.email
    );

    cleanedUsers.push(defaultAdmin, defaultUser, secondAdmin);

    localStorage.setItem('users', JSON.stringify(cleanedUsers));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.isBrowser) return;

    this.error = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = users.find(
      (u: any) =>
        u.email.toLowerCase() === this.email.trim().toLowerCase() &&
        u.password === this.password
    );

    if (!foundUser) {
      this.error = 'Email ou mot de passe incorrect';
      return;
    }

    const currentUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    };

    if (this.rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.removeItem('currentUser');
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.removeItem('currentUser');
    }

    if (foundUser.role === 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }

    if (foundUser.role === 'user') {
      this.router.navigate(['/user-dashboard']);
      return;
    }

    this.error = 'Rôle utilisateur invalide';
  }
}
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  showPassword = false;
  showConfirmPassword = false;

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister(): void {
    if (!this.isBrowser) return;

    this.error = '';
    this.success = '';

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.some((u: any) => u.email === this.email.trim());

    if (exists) {
      this.error = 'Ce compte existe déjà';
      return;
    }

    const newUser = {
      id: Date.now(),
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.success = 'Compte créé avec succès';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    CartDrawerComponent,
    AuthModalComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public isAuthModalOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Reactively subscribe to global authentication modal trigger requests
    this.authService.showAuthModal$.subscribe(open => {
      this.isAuthModalOpen = open;
    });
  }

  public openAuth(): void {
    this.authService.showAuthModal$.next(true);
  }

  public closeAuth(): void {
    this.authService.showAuthModal$.next(false);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastState } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="state.visible" 
         [ngClass]="{
           'translate-y-0 opacity-100': state.visible,
           'translate-y-12 opacity-0 pointer-events-none': !state.visible,
           'border-emerald-500 bg-emerald-50 text-emerald-800': state.type === 'success',
           'border-rose-500 bg-rose-50 text-rose-800': state.type === 'error',
           'border-primary bg-indigo-50 text-indigo-900': state.type === 'info'
         }"
         class="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-premium glassmorphism transition-all duration-500 transform ease-out max-w-sm cursor-pointer"
         (click)="dismiss()">
      
      <!-- Icon Dynamic -->
      <div class="flex-shrink-0">
        <!-- Success Icon -->
        <svg *ngIf="state.type === 'success'" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        
        <!-- Error Icon -->
        <svg *ngIf="state.type === 'error'" class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>

        <!-- Info Icon -->
        <svg *ngIf="state.type === 'info'" class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <!-- Message Text -->
      <div class="text-sm font-medium pr-1">
        {{ state.message }}
      </div>

      <!-- Close Button -->
      <button class="ml-auto text-slate-400 hover:text-slate-600 focus:outline-none">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `
})
export class ToastComponent implements OnInit {
  public state: ToastState = {
    message: '',
    type: 'success',
    visible: false
  };

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(state => {
      this.state = state;
    });
  }

  public dismiss(): void {
    this.toastService.hide();
  }
}

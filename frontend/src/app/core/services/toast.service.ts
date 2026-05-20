import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastState>({
    message: '',
    type: 'success',
    visible: false
  });
  
  public toastState$ = this.toastSubject.asObservable();
  private timeoutId: any;

  constructor() {}

  public showSuccess(message: string): void {
    this.show(message, 'success');
  }

  public showError(message: string): void {
    this.show(message, 'error');
  }

  public showInfo(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: 'success' | 'error' | 'info'): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toastSubject.next({
      message,
      type,
      visible: true
    });

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, 4000); // Hide after 4 seconds
  }

  public hide(): void {
    this.toastSubject.next({
      ...this.toastSubject.value,
      visible: false
    });
  }
}

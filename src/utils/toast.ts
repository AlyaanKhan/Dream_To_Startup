import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private container: HTMLDivElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    if (typeof window === 'undefined') return;

    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }

  private getToastIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>';
      case 'error':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      case 'warning':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
      case 'info':
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
  }

  private getToastStyles(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
    }
  }

  private createToastElement(toast: Toast): HTMLDivElement {
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${this.getToastStyles(toast.type)}`;
    toastElement.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          ${this.getToastIcon(toast.type)}
        </div>
        <div class="toast-message">${toast.message}</div>
        <button class="toast-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Add close functionality
    const closeBtn = toastElement.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.removeToast(toastElement);
      });
    }

    return toastElement;
  }

  show(message: string, type: ToastType = 'info', duration: number = 5000) {
    if (!this.container) return;

    const toast: Toast = {
      id: Date.now().toString(),
      type,
      message,
      duration,
    };

    const toastElement = this.createToastElement(toast);
    this.container.appendChild(toastElement);

    // Animate in
    setTimeout(() => {
      toastElement.classList.add('toast-show');
    }, 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toastElement);
      }, duration);
    }
  }

  private removeToast(toastElement: HTMLDivElement) {
    toastElement.classList.remove('toast-show');
    toastElement.classList.add('toast-hide');
    
    setTimeout(() => {
      if (toastElement.parentElement) {
        toastElement.parentElement.removeChild(toastElement);
      }
    }, 300);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }
}

export const toast = new ToastManager();

export const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
  toast.show(message, type, duration);
}; 
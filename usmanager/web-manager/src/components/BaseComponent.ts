import React from "react";
import M from "materialize-css";

export default class BaseComponent<P, S> extends React.Component<P, S> {

  private toasts: M.Toast[] = [];

  componentWillUnmount(): void {
    this.toasts.forEach(toast => toast.timeRemaining = 1000);
  }

  removeToast = (html: string) => () =>
    this.toasts.forEach((toast, index) => {
        if (toast.options.html === html) {
          delete this.toasts[index];
        }
      }
    );

  toast(message: string, displayLength: number = 4000, error?: string, instance?: boolean, unique?: boolean): void {
    const html = `<div>${message}${error ? `: <b class="red-text">${error}</b>` : ''}</div>`;
    if (!unique || !this.toasts.some(toast => toast.options.html === html)) {
      const toast = M.toast({ html , displayLength,  completeCallback: this.removeToast(html)});
      if (instance || unique) {
        this.toasts.push(toast);
      }
    }
  };

}

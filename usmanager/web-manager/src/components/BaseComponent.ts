import React from "react";
import M from "materialize-css";

export default class BaseComponent<P, S> extends React.Component<P, S> {

  private toasts: M.Toast[] = [];

  componentWillUnmount(): void {
    this.toasts.forEach(toast => toast.timeRemaining = 1000);
  }

  toast(message: string, displayLength: number = 4000, error?: string, instance?: boolean): void {
    const html = `<div>${message}` + (error ? `: <b class="red-text">${error}</b></div>` : '</div>');
    const toast = M.toast({ html , displayLength });
    if (instance) {
      this.toasts.push(toast);
    }
  };

}

import { Injectable, ComponentRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface DialogConfig {
  width?: string;
  height?: string;
  disableClose?: boolean;
  data?: any;
}

export interface DialogRef<T = any> {
  afterClosed(): Observable<T | undefined>;
  close(result?: T): void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogContainer?: ViewContainerRef;
  private activeDialogs: Map<string, { componentRef: ComponentRef<any>, dialogRef: DialogRefImpl }> = new Map();

  setContainer(container: ViewContainerRef): void {
    this.dialogContainer = container;
  }

  open<T = any>(component: any, config?: DialogConfig): DialogRef<T> {
    if (!this.dialogContainer) {
      throw new Error('Dialog container not set. Call setContainer() first.');
    }

    const dialogId = `dialog-${Date.now()}-${Math.random()}`;
    const componentRef = this.dialogContainer.createComponent(component);

    // Set data if provided
    if (config?.data && componentRef.instance) {
      Object.assign(componentRef.instance, { data: config.data });
    }

    const dialogRef = new DialogRefImpl<T>();

    // Store reference
    this.activeDialogs.set(dialogId, { componentRef, dialogRef });

    // Handle close
    dialogRef._close$.subscribe(() => {
      componentRef.destroy();
      this.activeDialogs.delete(dialogId);
    });

    return dialogRef;
  }

  closeAll(): void {
    this.activeDialogs.forEach(({ dialogRef }) => {
      dialogRef.close();
    });
    this.activeDialogs.clear();
  }
}

class DialogRefImpl<T = any> implements DialogRef<T> {
  private _afterClosed$ = new Subject<T | undefined>();
  _close$ = new Subject<void>();

  afterClosed(): Observable<T | undefined> {
    return this._afterClosed$.asObservable();
  }

  close(result?: T): void {
    this._afterClosed$.next(result as T | undefined);
    this._afterClosed$.complete();
    this._close$.next();
    this._close$.complete();
  }
}


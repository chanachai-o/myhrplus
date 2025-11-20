import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';

/**
 * Service for managing idle timeout and session expiration
 * Monitors user activity and triggers timeout events
 */
@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private _count: number = 0;
  private _serviceId: string = `idleTimeoutSvc-${Math.floor(Math.random() * 10000)}`;
  private _timeoutMinutes: number = 20; // Default 20 minutes
  private timerSubscription: Subscription | undefined;
  private timer: Observable<number> | undefined;
  private resetOnTrigger: boolean = false;
  public timeoutExpired: Subject<number> = new Subject<number>();

  constructor() {
    // Start timer on service initialization
    this.startTimer();
  }

  /**
   * Start the idle timeout timer
   */
  public startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timer = timer(this._timeoutMinutes * 60 * 1000);
    this.timerSubscription = this.timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  /**
   * Stop the idle timeout timer
   */
  public stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  /**
   * Reset the idle timeout timer
   */
  public resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  /**
   * Set timeout duration in minutes
   * @param minutes - Timeout duration in minutes
   */
  public setTimeout(minutes: number): void {
    this._timeoutMinutes = minutes;
    this.resetTimer();
  }

  /**
   * Get current timeout duration in minutes
   * @returns Timeout duration in minutes
   */
  public getTimeout(): number {
    return this._timeoutMinutes;
  }

  /**
   * Enable/disable auto-reset on trigger
   * @param enable - Enable auto-reset
   */
  public setResetOnTrigger(enable: boolean): void {
    this.resetOnTrigger = enable;
  }

  /**
   * Get timeout expired observable
   * @returns Observable that emits when timeout expires
   */
  public getTimeoutExpired$(): Observable<number> {
    return this.timeoutExpired.asObservable();
  }

  /**
   * Get service ID (for debugging)
   * @returns Service ID
   */
  public getServiceId(): string {
    return this._serviceId;
  }

  private timerComplete(n: number): void {
    this.timeoutExpired.next(++this._count);

    if (this.resetOnTrigger) {
      this.startTimer();
    }
  }
}


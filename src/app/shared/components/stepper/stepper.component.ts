import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface StepperStep {
  label: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  optional?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep: number = 0;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() linear: boolean = false;
  @Input() showStepNumbers: boolean = true;
  @Input() showStepIcons: boolean = true;

  @Output() stepChange = new EventEmitter<number>();
  @Output() complete = new EventEmitter<void>();

  ngOnInit(): void {
    // Validate current step
    if (this.currentStep < 0) {
      this.currentStep = 0;
    } else if (this.currentStep >= this.steps.length) {
      this.currentStep = this.steps.length - 1;
    }
  }

  onStepClick(index: number): void {
    if (this.canNavigateToStep(index)) {
      this.currentStep = index;
      this.stepChange.emit(index);
    }
  }

  onNext(): void {
    if (this.canNavigateToStep(this.currentStep + 1)) {
      this.currentStep++;
      this.stepChange.emit(this.currentStep);
    }
  }

  onPrevious(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.stepChange.emit(this.currentStep);
    }
  }

  onComplete(): void {
    this.complete.emit();
  }

  canNavigateToStep(index: number): boolean {
    if (index < 0 || index >= this.steps.length) {
      return false;
    }

    if (this.steps[index].disabled) {
      return false;
    }

    if (this.linear) {
      // In linear mode, can only navigate to completed steps or next step
      for (let i = 0; i < index; i++) {
        if (!this.steps[i].completed && !this.steps[i].optional) {
          return false;
        }
      }
    }

    return true;
  }

  isStepCompleted(index: number): boolean {
    return this.steps[index]?.completed || false;
  }

  isStepActive(index: number): boolean {
    return index === this.currentStep;
  }

  isStepOptional(index: number): boolean {
    return this.steps[index]?.optional || false;
  }

  getStepStatus(index: number): 'completed' | 'active' | 'pending' {
    if (this.isStepCompleted(index)) {
      return 'completed';
    } else if (this.isStepActive(index)) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  canGoNext(): boolean {
    return this.canNavigateToStep(this.currentStep + 1);
  }

  canGoPrevious(): boolean {
    return this.currentStep > 0;
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }
}



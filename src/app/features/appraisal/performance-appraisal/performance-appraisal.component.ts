import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppraisalService, Appraisal, AppraisalGoal } from '../services/appraisal.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-performance-appraisal',
  templateUrl: './performance-appraisal.component.html',
  styleUrls: ['./performance-appraisal.component.scss']
})
export class PerformanceAppraisalComponent implements OnInit {
  appraisalForm: FormGroup;
  goalsForm: FormGroup;
  appraisal: Appraisal | null = null;
  goals: AppraisalGoal[] = [];
  loading = false;
  isEditMode = false;
  activeTab = 0;

  constructor(
    private fb: FormBuilder,
    private appraisalService: AppraisalService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.appraisalForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      appraisalYear: [new Date().getFullYear(), [Validators.required]],
      appraisalPeriod: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      appraiserId: [''],
      comments: ['']
    });

    this.goalsForm = this.fb.group({
      goals: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.loadAppraisal(params['id']);
      }
    });
  }

  loadAppraisal(appraisalId: string): void {
    this.loading = true;
    this.appraisalService.getAppraisal(appraisalId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.appraisal = response.data;
          if (this.appraisal) {
            this.appraisalForm.patchValue(this.appraisal);
          }
          this.loadGoals(appraisalId);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appraisal:', error);
        this.loading = false;
      }
    });
  }

  loadGoals(appraisalId: string): void {
    this.appraisalService.getGoals(appraisalId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.goals = response.data;
          this.populateGoalsForm();
        }
      },
      error: (error) => {
        console.error('Error loading goals:', error);
      }
    });
  }

  populateGoalsForm(): void {
    const goalsArray = this.goalsForm.get('goals') as FormArray;
    goalsArray.clear();
    this.goals.forEach(goal => {
      goalsArray.push(this.createGoalFormGroup(goal));
    });
  }

  createGoalFormGroup(goal?: AppraisalGoal): FormGroup {
    return this.fb.group({
      goalId: [goal?.goalId || ''],
      goalTitle: [goal?.goalTitle || '', [Validators.required]],
      goalDescription: [goal?.goalDescription || '', [Validators.required]],
      targetValue: [goal?.targetValue || ''],
      actualValue: [goal?.actualValue || ''],
      weight: [goal?.weight || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      score: [goal?.score || ''],
      category: [goal?.category || ''],
      dueDate: [goal?.dueDate || '']
    });
  }

  get goalsArray(): FormArray {
    return this.goalsForm.get('goals') as FormArray;
  }

  addGoal(): void {
    const goalsArray = this.goalsForm.get('goals') as FormArray;
    goalsArray.push(this.createGoalFormGroup());
  }

  removeGoal(index: number): void {
    const goalsArray = this.goalsForm.get('goals') as FormArray;
    const goal = goalsArray.at(index).value;
    
    if (goal.goalId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Delete Goal',
          message: 'Are you sure you want to delete this goal?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.appraisal?.appraisalId) {
            this.appraisalService.deleteGoal(this.appraisal.appraisalId, goal.goalId).subscribe({
              next: (response) => {
                if (response.success) {
                  goalsArray.removeAt(index);
                  this.notificationService.showSuccess('Goal deleted successfully');
                }
              },
              error: (error) => {
                this.notificationService.showError('Failed to delete goal');
              }
            });
          }
        }
      });
    } else {
      goalsArray.removeAt(index);
    }
  }

  saveAppraisal(): void {
    if (this.appraisalForm.valid) {
      this.loading = true;
      const appraisalData: Appraisal = this.appraisalForm.value;

      if (this.isEditMode && this.appraisal?.appraisalId) {
        this.appraisalService.updateAppraisal(this.appraisal.appraisalId, appraisalData).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Appraisal updated successfully');
              this.saveGoals();
            } else {
              this.notificationService.showError(response.error?.message || 'Failed to update appraisal');
              this.loading = false;
            }
          },
          error: (error) => {
            this.notificationService.showError('Failed to update appraisal');
            this.loading = false;
          }
        });
      } else {
        this.appraisalService.createAppraisal(appraisalData).subscribe({
          next: (response) => {
            if (response.success && response.data?.appraisalId) {
              this.appraisal = response.data;
              this.isEditMode = true;
              this.notificationService.showSuccess('Appraisal created successfully');
              this.saveGoals();
            } else {
              this.notificationService.showError(response.error?.message || 'Failed to create appraisal');
              this.loading = false;
            }
          },
          error: (error) => {
            this.notificationService.showError('Failed to create appraisal');
            this.loading = false;
          }
        });
      }
    }
  }

  saveGoals(): void {
    if (!this.appraisal?.appraisalId) {
      this.loading = false;
      return;
    }

    const goalsArray = this.goalsForm.get('goals') as FormArray;
    const goalsToSave = goalsArray.value;
    let savedCount = 0;
    const totalGoals = goalsToSave.length;

    if (totalGoals === 0) {
      this.loading = false;
      return;
    }

    goalsToSave.forEach((goal: any, index: number) => {
      const goalData: AppraisalGoal = {
        appraisalId: this.appraisal!.appraisalId!,
        goalTitle: goal.goalTitle,
        goalDescription: goal.goalDescription,
        targetValue: goal.targetValue,
        actualValue: goal.actualValue,
        weight: goal.weight,
        score: goal.score,
        category: goal.category,
        dueDate: goal.dueDate,
        status: 'active'
      };

      if (goal.goalId) {
        this.appraisalService.updateGoal(this.appraisal!.appraisalId!, goal.goalId, goalData).subscribe({
          next: (response) => {
            savedCount++;
            if (savedCount === totalGoals) {
              this.notificationService.showSuccess('Goals saved successfully');
              this.loading = false;
            }
          },
          error: (error) => {
            savedCount++;
            if (savedCount === totalGoals) {
              this.loading = false;
            }
          }
        });
      } else {
        this.appraisalService.createGoal(this.appraisal!.appraisalId!, goalData).subscribe({
          next: (response) => {
            savedCount++;
            if (savedCount === totalGoals) {
              this.notificationService.showSuccess('Goals saved successfully');
              this.loading = false;
            }
          },
          error: (error) => {
            savedCount++;
            if (savedCount === totalGoals) {
              this.loading = false;
            }
          }
        });
      }
    });
  }

  submitAppraisal(): void {
    if (!this.appraisal?.appraisalId) {
      this.notificationService.showWarning('Please save the appraisal first');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Submit Appraisal',
        message: 'Are you sure you want to submit this appraisal? Once submitted, it cannot be edited.',
        confirmText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.appraisalService.submitAppraisal(this.appraisal!.appraisalId!).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.showSuccess('Appraisal submitted successfully');
              this.router.navigate(['/appraisal/history']);
            } else {
              this.notificationService.showError(response.error?.message || 'Failed to submit appraisal');
            }
            this.loading = false;
          },
          error: (error) => {
            this.notificationService.showError('Failed to submit appraisal');
            this.loading = false;
          }
        });
      }
    });
  }

  calculateTotalWeight(): number {
    const goalsArray = this.goalsForm.get('goals') as FormArray;
    let total = 0;
    goalsArray.controls.forEach(control => {
      const weight = control.get('weight')?.value || 0;
      total += parseFloat(weight) || 0;
    });
    return total;
  }

  navigateToAppraisal(): void {
    this.router.navigate(['/appraisal']);
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'draft': '',
      'submitted': 'primary',
      'in-review': 'accent',
      'approved': 'accent',
      'rejected': 'warn',
      'completed': 'primary'
    };
    return statusColors[status.toLowerCase()] || '';
  }
}


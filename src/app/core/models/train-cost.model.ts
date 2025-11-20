import { Expense } from './expense.model';
import { ExpGrp } from './expgrp.model';

/**
 * Training cost model
 */
export interface TrainCost {
  trainingId: string;
  expense: Expense;
  expGrp: ExpGrp;
  expensePerCapita: number;
  estimate: number;
  used: number;
}



export type TransitionOption = "reset" | "carry" | "partial" | "transfer";

export interface BudgetEnvelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
  transferTargetTitle?: string;
}

export interface TransitionEnvelope {
  id: string;
  title: string;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
}

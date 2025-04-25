
export type TransitionOption = "reset" | "carry" | "partial" | "transfer" | "multi-transfer" | "keep";

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
  multiTransfers?: {
    targetId: string;
    targetTitle: string;
    amount: number;
  }[];
}

export interface TransitionEnvelope {
  id: string;
  title: string;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
  multiTransfers?: {
    targetId: string;
    amount: number;
  }[];
}

export interface MultiTransfer {
  targetId: string;
  amount: number;
}

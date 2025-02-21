
export type TransitionOption = "reset" | "carry" | "partial" | "transfer";

export interface TransitionEnvelope {
  id: string;
  title: string;
  transitionOption: TransitionOption;
  partialAmount?: number;
  transferTargetId?: string;
}

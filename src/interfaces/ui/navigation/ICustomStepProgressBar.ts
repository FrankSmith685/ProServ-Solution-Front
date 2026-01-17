export interface StepItem {
  label: string;
  path: string;
}

export interface CustomStepProgressBarProps {
  steps: StepItem[];
  currentPath: string;
  maxStep: number;
}

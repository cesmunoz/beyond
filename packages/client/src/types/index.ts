export type Pair = {
  key: string;
  value: string;
};

export type ChildrenProps = {
  children?: React.ReactNode;
};

export type GenericKeyboardEvent = React.KeyboardEvent<HTMLDivElement> | KeyboardEvent;

export type RateAnswer = {
  category: string;
  id: number;
  value: number | string;
};

export type StepKey =
  | 'Start'
  | 'AboutMe'
  | 'Education'
  | 'Work'
  | 'Expectation'
  | 'Interlude_1'
  | 'Interlude_2'
  | 'Collaborators'
  | 'End';

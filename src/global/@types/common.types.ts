export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type Id = string;

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

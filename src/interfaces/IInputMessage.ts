export interface IInputMessageProps {
  input: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholderText?: string;
  customButtonStyle?: React.CSSProperties;
}

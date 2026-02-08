import { Label } from "../ui/field";

type RequiredLabelProps = {
  children: React.ReactNode;
};

export function RequiredLabel({ children }: RequiredLabelProps) {
  return (
    <Label>
      {children}
      <span className="ml-1 text-danger">*</span>
    </Label>
  );
}

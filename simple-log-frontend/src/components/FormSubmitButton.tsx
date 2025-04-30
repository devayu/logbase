import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type FromSubmitButtonProps = {
  children: React.ReactNode;
  loadingText?: string;
} & ButtonProps;

export const FormSubmitButton = (buttonProps: FromSubmitButtonProps) => {
  const {
    children,
    loadingText = "Please wait...",
    ...restProps
  } = buttonProps;
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || buttonProps.disabled}
      {...restProps}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? loadingText : children}
    </Button>
  );
};

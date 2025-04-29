import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type FromSubmitButtonProps = {
  text: string;
  loadingText?: string;
} & ButtonProps;
export const FromSubmitButton = (buttonProps: FromSubmitButtonProps) => {
  const { text, loadingText = "Please wait..." } = buttonProps;
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || buttonProps.disabled}
      {...buttonProps}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? loadingText : text}
    </Button>
  );
};

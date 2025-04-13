
import { useState } from "react";
import { Copy, EyeOff, Eye, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { regenerateApiKey } from "@/services/apiKey";

interface ApiKeyCardProps {
  apiKey?: string;
}

export const ApiKeyCard = ({ apiKey = "sk_test_12345678901234567890" }: ApiKeyCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleRegenerateKey = async () => {
    setIsRegenerating(true);
    try {
      await regenerateApiKey();
      toast({
        title: "API Key regenerated",
        description: "Your new API key has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to regenerate API Key",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const displayKey = isVisible
    ? apiKey
    : apiKey.substring(0, 3) + "•".repeat(apiKey.length - 6) + apiKey.slice(-3);

  return (
    <Card className="card-gradient overflow-hidden border border-border/30">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          API Key
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <div className="w-full flex items-center justify-between rounded-md bg-background/20 px-3 py-2 text-sm font-mono">
            {displayKey}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="ml-2 h-8 w-8 rounded-full p-0"
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isVisible ? "Hide API Key" : "Show API Key"}
              </span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Use this API key to initialize the SDK in your application. Keep this key secure.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="secondary" size="sm" onClick={handleCopyApiKey}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerateKey}
          disabled={isRegenerating}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  );
};

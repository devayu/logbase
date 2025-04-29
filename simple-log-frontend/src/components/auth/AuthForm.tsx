"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { loginUserAction, registerUserAction } from "@/auth/actions/auth";
import { FormSubmitButton } from "@/components/FormSubmitButton";

const authSchema = z.object({
  name: z.string().min(1),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTab, setSelectedTab] = useState("login");
  const { toast } = { toast: ({}) => {} }; // TODO: add toast component;
  const navigate = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  console.log(selectedTab);
  return (
    <Card className="w-full max-w-md border border-border/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          <span className="gradient-text">Simple Log</span>
        </CardTitle>
      </CardHeader>
      <Tabs
        defaultValue="login"
        className="w-full"
        value={selectedTab}
        onValueChange={(activeTab) => setSelectedTab(activeTab)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              className="space-y-4"
              action={async (formData: FormData) => {
                if (selectedTab === "login") {
                  loginUserAction(formData);
                } else {
                  registerUserAction(formData);
                }
              }}
            >
              {selectedTab === "register" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John doe"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter>
                <TabsContent value="login" className="mt-0 w-full">
                  <FormSubmitButton loadingText="Logging in..." text="Login" />
                </TabsContent>
                <TabsContent value="register" className="mt-0 w-full">
                  <FormSubmitButton
                    loadingText="Creating account.."
                    text="Create account"
                  />
                </TabsContent>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Tabs>
    </Card>
  );
};

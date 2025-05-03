import { AuthForm } from "@/components/auth/AuthForm";

export default async function Home() {
  return (
    <div className="w-full items-center justify-center flex mt-10 p-4">
      <AuthForm></AuthForm>
    </div>
  );
}

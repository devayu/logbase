import { SettingsMenu } from "@/components/dashboard/SettingsMenu";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex px-6">
      <SettingsMenu></SettingsMenu>
      <div className="w-full">{children}</div>
    </div>
  );
}

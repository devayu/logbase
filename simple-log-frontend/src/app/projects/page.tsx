import { NewProjectCard } from "@/components/projects/NewProjectCard";
import ProjectCards from "@/components/projects/ProjectCards";

import { getProjects } from "@/services/projects";
import { Loader2 } from "lucide-react";

export default async function Home() {
  const { data: projects, isLoading } = (await getProjects()) || {
    data: [],
    isLoading: false,
    error: null,
  };

  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //     createdAt: "2021-01-01",
  //   },
  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //   },
  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //   },
  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //   },
  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //   },
  //   {
  //     name: "Page A",
  //     description: "Page A description",
  //   },
  // ];
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <NewProjectCard></NewProjectCard>

        {isLoading && <Loader2 className="animate-spin" />}
        <ProjectCards projects={projects}></ProjectCards>
      </div>
    </div>
  );
}

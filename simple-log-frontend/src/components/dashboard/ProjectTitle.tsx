"use client";

export const ProjectTitle = ({
  name,
  description,
}: {
  name?: string;
  description?: string | null;
}) => {
  return (
    <div className="p-6 py-4 pb-0">
      <h2 className="font-bold text-4xl">{name}</h2>
      {description && (
        <p className="font-normal text-sm opacity-80">{description}</p>
      )}
    </div>
  );
};

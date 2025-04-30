import Image from "next/image";
export const LogbaseLogo = () => {
  return (
    <div className="flex gap-1 items-center">
      <Image
        src="/logbase.svg"
        alt="Logbase Logo"
        className="w-5 h-5"
        width={20}
        height={20}
      />
      <span className="text-lg font-bold gradient-text">Logbase</span>
    </div>
  );
};

import { mkConfig, generateCsv, download } from "export-to-csv";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const csvExport = (data: Record<string, any>[], fileName: string) => {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: fileName,
    replaceUndefinedWith: "na",
  });
  const csv = generateCsv(csvConfig)(data);
  return download(csvConfig)(csv);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonExport = (data: Record<string, any>[], fileName: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.json`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

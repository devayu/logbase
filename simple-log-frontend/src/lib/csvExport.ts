import { mkConfig, generateCsv, download } from "export-to-csv";
export const csvExport = (data: Record<string, any>[], fileName: string) => {
  const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: fileName });
  const csv = generateCsv(csvConfig)(data);
  return download(csvConfig)(csv);
};

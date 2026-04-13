import { saveAs } from "file-saver";

export const exportCSV = (filename, data) => {
  const csv = ["username", ...data].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  saveAs(blob, `${filename}.csv`);
};

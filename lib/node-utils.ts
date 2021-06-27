import fs from "fs";

export const getDistricts = (): CT.District[] => {
  const data = fs.readFileSync("./districts.json", { encoding: "utf8" });
  const paths = JSON.parse(data);
  return paths;
};

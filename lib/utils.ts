import { Center } from "./cowin";

export const genDistrictName = (district: CT.District): string =>
  `${district.district_name}, ${district.state_name}`;

export const districtLink = (district: CT.District): string =>
  `/district/${district.district_id}`;

export const todayDate = (): string =>
  new Date().toLocaleDateString("en-IN", {}).replace(/\//g, "-");

export const sortCenters = (
  centers: Center[],
  sortKey?:
    | "available_capacity"
    | "available_capacity_dose1"
    | "available_capacity_dose2"
): Center[] => {
  const key = sortKey ?? "available_capacity";
  return centers.sort((a, b) => {
    const x = a.sessions.reduce((p, c) => p + c[key], 0);
    const y = b.sessions.reduce((p, c) => p + c[key], 0);
    return y - x;
  });
};

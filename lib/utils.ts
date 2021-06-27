export const genDistrictName = (district: CT.District): string =>
  `${district.district_name}, ${district.state_name}`;

export const districtLink = (district: CT.District): string =>
  `/state/${district.state_id}/district/${district.district_id}`;

export const todayDate = (): string =>
  new Date().toLocaleDateString("en-IN", {}).replace(/\//g, "-");

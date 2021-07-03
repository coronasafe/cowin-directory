import axios from "axios";

const BASE_URL = "https://cdn-api.co-vin.in/api";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36";
const FETCH_OPTIONS = {
  headers: typeof Window === "undefined" && {
    "User-Agent": USER_AGENT,
  },
};

export type CalendarByDistrictType = {
  centers: Center[];
  lastUpdatedISO: string;
};

export enum FeeTypes {
  Free = "Free",
  Paid = "Paid",
}

export type Center = {
  center_id: number;
  name: string;
  address: string;
  state_name: string;
  district_name: string;
  block_name: string;
  pincode: number;
  lat: number;
  long: number;
  from: string;
  to: string;
  fee_type: FeeTypes;
  sessions: Session[];
};

export type Session = {
  session_id: string;
  date: string;
  available_capacity: number;
  available_capacity_dose1: number;
  available_capacity_dose2: number;
  min_age_limit: number;
  vaccine: string;
  slots: string[];
};

export const calendarByDistrict = async (
  districtId: string,
  date: string
): Promise<CalendarByDistrictType> => {
  const res = await axios(
    `${BASE_URL}/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`,
    FETCH_OPTIONS
  );
  const data = await res.data;
  return {
    ...data,
    lastUpdatedISO: new Date().toISOString(),
  };
};

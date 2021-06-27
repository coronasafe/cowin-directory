const BASE_URL = "https://cdn-api.co-vin.in/api";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36";
const FETCH_OPTIONS = {
  headers: {
    "User-Agent": USER_AGENT,
  },
};

type CalendarByDistrictType = {
  centers: Center[];
};

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
  fee_type: string;
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
): Promise<CalendarByDistrictType> =>
  (
    await fetch(
      `${BASE_URL}/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`,
      FETCH_OPTIONS
    )
  ).json();

export interface States {
  states: State[];
  ttl: number;
}

export interface State {
  state_id: number;
  state_name: string;
}

export const getStates = async (): Promise<States> =>
  (await fetch(`${BASE_URL}/v2/admin/location/states`)).json();

export interface Districts {
  districts: District[];
  ttl: number;
}

export interface District {
  district_id: number;
  district_name: string;
}
export const getDistricts = async (stateId: string): Promise<District> =>
  (await fetch(`${BASE_URL}/v2/admin/location/districts/${stateId}`)).json();

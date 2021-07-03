import type { NextApiRequest, NextApiResponse } from "next";
import { calendarByDistrict, CalendarByDistrictType } from "../../../lib/cowin";
import { todayDate } from "../../../lib/utils";

type Response =
  | CalendarByDistrictType
  | {
      error?: any;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const districtId = req.query.district_id;
    if (typeof districtId === "string") {
      const calender = await calendarByDistrict(districtId, todayDate());
      return res
        .status(200)
        .setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate")
        .json(calender);
    } else {
      throw Error("Invalid parameter");
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}

// import CoronaSafeLogo from "../assets/coronaSafeLogo.svg";
// import { FOOTER_LINKS } from "../lib/constants";

import { Center } from "../lib/cowin";
import { useMemo, useState } from "react";
import { uniq, isEmpty } from "lodash-es";

type DistrictInfoProps = {
  centers: Center[];
};

type FiltersType = {
  dates: string[];
  min_age_limits: number[];
  vaccines: string[];
  pincodes: number[];
  fee_types: string[];
  dose_1_available_only: boolean;
  dose_2_available_only: boolean;
};

const initialFilter = {
  pincode: null,
  min_age_limit: [18, 45],
};

export default function DistrictInfo({ centers }: DistrictInfoProps) {
  const [filters, setFilters] = useState<FiltersType>(
    centers.reduce(
      (p: FiltersType, c: Center) => {
        const sessions = c.sessions;
        let result: FiltersType = {
          ...p,
          dates: uniq([...p.dates, ...sessions.map((x) => x.date)]),
          min_age_limits: uniq([
            ...p.min_age_limits,
            ...sessions.map((x) => x.min_age_limit),
          ]),
          vaccines: uniq([...p.vaccines, ...sessions.map((x) => x.vaccine)]),
          fee_types: uniq([...p.fee_types, c.fee_type]),
        };
        return result;
      },
      {
        dates: [],
        pincodes: [],
        min_age_limits: [],
        vaccines: [],
        fee_types: [],
        dose_1_available_only: false,
        dose_2_available_only: false,
      }
    )
  );

  const filteredCenters = useMemo(
    () =>
      centers
        .filter(
          (center) =>
            (isEmpty(filters.pincodes) ||
              (!isEmpty(filters.pincodes) &&
                filters.pincodes.includes(center.pincode))) &&
            filters.fee_types.includes(center.fee_type)
        )
        .map((center) => ({
          ...center,
          sessions: center.sessions.filter(
            (session) =>
              filters.dates.includes(session.date) &&
              filters.min_age_limits.includes(session.min_age_limit) &&
              filters.vaccines.includes(session.vaccine) &&
              (!filters.dose_1_available_only ||
                (filters.dose_1_available_only &&
                  session.available_capacity_dose1 > 0)) &&
              (!filters.dose_2_available_only ||
                (filters.dose_2_available_only &&
                  session.available_capacity_dose2 > 0))
          ),
        })),
    [filters, centers]
  );

  return (
    <>
      <div className="flex my-2">
        {/* TODO: Filters incomplete */}
        <div className="flex flex-col">
          <label className="text-xs">Pincode</label>
          <input
            className="text-sm card p-1 appearance-none outline-none h-8 w-28 border focus:border-green-500"
            onChange={(v) => {
              const parsed = v.target.value
                .split(",")
                .map((x) => Number.parseInt(x, 10));
              const hasNaN = parsed.some((x) => Number.isNaN(x));
              if (hasNaN) {
                setFilters({ ...filters, pincodes: [] });
                return;
              }
              setFilters({ ...filters, pincodes: parsed });
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {isEmpty(filteredCenters) && (
          <span className="text-sm">No centers available</span>
        )}
        {filteredCenters.map((center) => {
          return (
            <div key={center.center_id} className="card p-2">
              <div>
                <div className="flex space-x-2 items-center">
                  <span className="text-lg leading-none">{center.name}</span>
                  <div className="text-xs leading-none p-1 bg-green-100 text-bunker-600 rounded-lg">
                    {center.fee_type}
                  </div>
                </div>
                <div className="flex text-xs space-x-2">
                  <span>{center.address}</span>
                  <span>{center.pincode}</span>
                  <span>{center.block_name}</span>
                </div>
              </div>
              <span className="text-sm">Sessions</span>
              <div className="flex flex-wrap gap-2">
                {isEmpty(center.sessions) && (
                  <span className="text-sm">No session available</span>
                )}
                {center.sessions.map((session) => {
                  return (
                    <div key={session.session_id} className="card p-2 w-96">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex flex-col">
                            <span className="text-xs">Date</span>
                            <span>{session.date}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs">Minimum age limit</span>
                            <span>{session.min_age_limit}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs">Vaccine</span>
                            <span>{session.vaccine}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col">
                            <span className="text-xs">Available dose 1</span>
                            <span className="text-xl font-bold">
                              {session.available_capacity_dose1}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs">Available dose 2</span>
                            <span className="text-xl font-bold">
                              {session.available_capacity_dose2}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs">Slots</span>
                        <span className="flex flex-wrap gap-2 text-xxs">
                          {session.slots.map((slot, i) => (
                            <span
                              key={`slot_${session.session_id}_${i}`}
                              className="bg-green-100 rounded-lg p-1 text-bunker-600"
                            >
                              {slot}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

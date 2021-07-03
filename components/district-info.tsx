import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import uniq from "lodash/uniq";

import { useMemo, useState } from "react";
import { Center as CenterType, FeeTypes } from "../lib/cowin";
import { sortCenters } from "../lib/utils";
import Center from "./center";
import { Checkbox } from "./checkbox";

type DistrictInfoProps = {
  centers: CenterType[];
  lastUpdated: Date;
};

type FiltersType = {
  dates: string[];
  min_age_limits: number[];
  vaccines: string[];
  pincodes: number[];
  fee_types: Record<FeeTypes, boolean>;
  dose_1_available_only: boolean;
  dose_2_available_only: boolean;
};

export default function DistrictInfo({
  centers,
  lastUpdated,
}: DistrictInfoProps) {
  const defaultFilters = useMemo(
    () =>
      centers.reduce(
        (p: FiltersType, c: CenterType) => {
          const sessions = c.sessions;
          let result: FiltersType = {
            ...p,
            dates: uniq([...p.dates, ...sessions.map((x) => x.date)]),
            min_age_limits: uniq([
              ...p.min_age_limits,
              ...sessions.map((x) => x.min_age_limit),
            ]),
            vaccines: uniq([...p.vaccines, ...sessions.map((x) => x.vaccine)]),
          };
          return result;
        },
        {
          dates: [],
          pincodes: [],
          min_age_limits: [],
          vaccines: [],
          fee_types: {
            [FeeTypes.Free]: true,
            [FeeTypes.Paid]: true,
          },
          dose_1_available_only: true,
          dose_2_available_only: true,
        }
      ),
    [centers]
  );
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);

  const filteredCenters = useMemo(
    () =>
      sortCenters(
        centers
          .filter(
            (center) =>
              (isEmpty(filters.pincodes) ||
                (!isEmpty(filters.pincodes) &&
                  filters.pincodes.some((x) =>
                    center.pincode.toString().startsWith(x.toString())
                  ))) &&
              filters.fee_types[center.fee_type]
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
          }))
          .filter((center) => !isEmpty(center.sessions)),
        filters.dose_1_available_only === filters.dose_2_available_only
          ? "available_capacity"
          : filters.dose_1_available_only
          ? "available_capacity_dose1"
          : "available_capacity_dose2"
      ),
    [filters, centers]
  );

  return (
    <>
      <div className="flex my-2 gap-2">
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
        <div className="flex flex-col">
          <label className="text-xs">Dose 1</label>
          <Checkbox
            checked={filters.dose_1_available_only}
            onChange={(v) => {
              setFilters({
                ...filters,
                dose_1_available_only: v.target.checked,
              });
            }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs">Dose 2</label>
          <Checkbox
            checked={filters.dose_2_available_only}
            onChange={(v) => {
              setFilters({
                ...filters,
                dose_2_available_only: v.target.checked,
              });
            }}
          />
        </div>
        {map(FeeTypes, (feeType) => (
          <div key={`feetype_${feeType}`} className="flex flex-col">
            <label className="text-xs">{feeType}</label>
            <Checkbox
              checked={filters.fee_types[feeType]}
              onChange={(v) => {
                setFilters({
                  ...filters,
                  fee_types: {
                    ...filters.fee_types,
                    [feeType]: v.target.checked,
                  },
                });
              }}
            />
          </div>
        ))}
      </div>
      <div className="mb-2">
        <span className="text-xxs">Last Updated</span>{" "}
        <span className="text-sm">{lastUpdated.toLocaleString("en-IN")}</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {isEmpty(filteredCenters) ? (
          <span className="text-sm">No centers available</span>
        ) : (
          <>
            <span className="text-sm">
              Showing {filteredCenters.length} of {centers.length} center
              {centers.length > 1 ? "s" : ""}
            </span>
            {filteredCenters.map((center) => (
              <Center key={center.center_id} center={center} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

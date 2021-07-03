import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import { Center as CenterType, FeeTypes } from "../lib/cowin";
import Session from "./session";

type CenterProps = {
  center: CenterType;
};

export default function Center({ center }: CenterProps) {
  return (
    <div className="card p-2">
      <div>
        <div className="flex space-x-2 items-center">
          <span className="text-lg leading-none">{center.name}</span>
          <div
            className={clsx(
              "text-xs leading-none p-1 text-bunker-600 rounded-lg",
              center.fee_type === FeeTypes.Free && "bg-green-100",
              center.fee_type === FeeTypes.Paid && "bg-yellow-100"
            )}
          >
            {center.fee_type}
          </div>
        </div>
        <div className="flex flex-col text-xs">
          <span>{center.address}</span>
          <span>{center.block_name}</span>
          <span>{center.pincode}</span>
        </div>
      </div>
      <span className="text-sm">Sessions</span>
      <div className="flex flex-wrap gap-2">
        {isEmpty(center.sessions) && (
          <span className="text-sm">No session available</span>
        )}
        {center.sessions.map((session) => (
          <Session key={session.session_id} session={session} />
        ))}
      </div>
    </div>
  );
}

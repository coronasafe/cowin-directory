import { Session as SessionType } from "../lib/cowin";

type SessionProps = {
  session: SessionType;
};

export default function Session({ session }: SessionProps) {
  return (
    <div className="card p-2 w-96">
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
        {session.available_capacity === 0 ? (
          <span className="text-sm">No vaccine</span>
        ) : (
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
        )}
      </div>
    </div>
  );
}

import { Transition } from "@headlessui/react";
import Link from "next/link";
import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { Plus } from "react-feather";

import { STATES } from "../lib/constants";
import { districtLink } from "../lib/utils";

type TreeProps = {
  open?: boolean;
  content?: ReactNode;
  children?: ReactNode;
};

function Tree({ children, content, open }: TreeProps) {
  const [curOpen, setCurOpen] = useState(open !== undefined ? open : false);
  const toggle = useCallback(() => {
    setCurOpen(!curOpen);
  }, [curOpen, setCurOpen]);

  return (
    <div className="relative whitespace-nowrap overflow-hidden align-middle overflow-ellipsis pt-1 ml-2">
      <div
        className="inline-flex items-center cursor-pointer shine"
        onClick={toggle}
      >
        <Plus
          className=" align-middle w-4 h-4 mr-2"
          style={{ opacity: children ? 1 : 0.3 }}
        />
        <span className="align-middle">{content}</span>
      </div>
      <Transition
        as="div"
        className="ml-2 border-l border-dashed border-current"
        show={curOpen}
        enter="transition ease-in-out duration-100"
        enterFrom="transform opacity-0 translate-x-2 h-0"
        enterTo="transform opacity-100 h-auto"
        leave="transition ease-in-out duration-100"
        leaveFrom="transform opacity-100 h-auto"
        leaveTo="transform opacity-0 translate-x-2 h-0"
      >
        {children}
      </Transition>
    </div>
  );
}

type PathTreeType = Record<string, Array<CT.District>>;
type PathTreeViewProps = {
  districts: CT.District[];
};

function PathTree({ districts }: PathTreeViewProps) {
  const paths: PathTreeType = useMemo(
    () =>
      districts.reduce(
        (p: PathTreeType, c: CT.District) => ({
          ...p,
          [c.state_id]: [...(p[c.state_id] ?? []), c],
        }),
        {}
      ),
    [districts]
  );

  return (
    <>
      {Object.keys(paths).map((state_id) => (
        <Tree key={state_id} content={STATES[state_id]}>
          <div className="flex flex-col">
            {paths[state_id].map((district) => (
              <Link
                key={`${state_id}-${district}`}
                href={districtLink(district)}
              >
                <a className="shine ml-4">{district.district_name}</a>
              </Link>
            ))}
          </div>
        </Tree>
      ))}
    </>
  );
}

export default memo(PathTree);

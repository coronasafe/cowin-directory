import { Transition } from "@headlessui/react";
import fuzzysort from "fuzzysort";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { Menu, X } from "react-feather";
import { Scrollbar } from "react-scrollbars-custom";
import { useMeasure } from "react-use";
import { useCombobox } from "downshift";

import PathTree from "./pathtree";
import { districtLink, genDistrictName } from "../lib/utils";
import clsx from "clsx";

type SelectModalProps = {
  districts: CT.District[];
};

function SelectModal({ districts }: SelectModalProps) {
  const [showModal, setShowModal] = useState(false);
  const handleModalButton = useCallback(
    () => setShowModal(!showModal),
    [showModal, setShowModal]
  );
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <>
      <button
        type="button"
        className="absolute right-0 appearance-none outline-none h-12 focus:outline-none pr-2 shine"
        onClick={handleModalButton}
      >
        <Menu className="w-6" />
      </button>
      <Transition
        as="div"
        className="fixed top-0 right-0 z-40 h-screen sm:max-w-sm w-full p-4"
        show={showModal}
        enter="transition ease-in-out duration-200"
        enterFrom="transform translate-x-full"
        enterTo="transform"
        leave="transition ease-in-out duration-200"
        leaveFrom="transform"
        leaveTo="transform translate-x-full"
      >
        <div className="flex flex-col h-full w-full card p-2 dark:border-green-500 text-xs sm:text-base overflow-hidden">
          <div className="flex justify-between mb-1 items-center">
            <span className="font-bold uppercase">District Menu</span>
            <button
              type="button"
              className="appearance-none outline-none focus:outline-none shine"
              onClick={handleModalButton}
            >
              <X className="w-6" />
            </button>
          </div>
          <div ref={ref} className="flex flex-col flex-1">
            <Scrollbar style={{ height }}>
              <PathTree districts={districts} />
            </Scrollbar>
          </div>
        </div>
      </Transition>
    </>
  );
}

type SearchProps = {
  districts: CT.District[];
  limit?: number;
  showModal?: boolean;
  initSelected?: CT.District | null;
};

export default function Search({
  districts,
  limit = 5,
  showModal = false,
  initSelected = null,
}: SearchProps) {
  const router = useRouter();
  const [inputItems, setInputItems] = useState(districts);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? genDistrictName(item) : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) router.push(districtLink(selectedItem));
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        fuzzysort
          .go(inputValue ?? "", districts, {
            keys: ["state_name", "district_name"],
            limit,
          })
          .map((a) => a.obj)
      );
    },
  });

  return (
    <>
      <div className="flex flex-col text-sm sm:text-xl w-full relative z-30">
        <div {...getComboboxProps()}>
          <input
            {...getInputProps()}
            placeholder={
              initSelected ? genDistrictName(initSelected) : "Search for a LSG"
            }
            className="card pl-2 pr-10 appearance-none outline-none h-12 w-full border focus:border-green-500"
          />
        </div>
        {showModal && <SelectModal districts={districts} />}
        <ul
          {...getMenuProps()}
          className={clsx(
            "absolute mt-14 w-full bg-white dark:bg-bunker-600 rounded-lg border border-green-500",
            (!isOpen || inputItems.length === 0) && "invisible"
          )}
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                className={clsx(
                  "flex flex-1 appearance-none focus:outline-none px-2 truncate",
                  highlightedIndex !== index &&
                    "bg-transparent dark:bg-transparent",
                  highlightedIndex === index && "bg-green-500 dark:bg-green-500"
                )}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {genDistrictName(item)}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

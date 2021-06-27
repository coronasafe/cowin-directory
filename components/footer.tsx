import CoronaSafeLogo from "../assets/coronaSafeLogo.svg";
import { FOOTER_LINKS, REPO_LINK } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="flex flex-col space-y-2 my-4 mx-6">
      <div className="flex text-xs xs:text-sm space-x-2">
        {FOOTER_LINKS.map((l) => (
          <a key={l.label} className="shine" href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex flex-col">
        <a
          href="https://coronasafe.network/"
          className="inline-flex text-xxs xs:text-xs space-x-1 shine"
        >
          <span>Copyright © 2021</span>
          <CoronaSafeLogo className="h-4" aria-hidden="true" />
        </a>
        <a href={`${REPO_LINK}/blob/master/LICENSE`} className="text-xxs shine">
          Released under the MIT License
        </a>
      </div>
    </footer>
  );
}

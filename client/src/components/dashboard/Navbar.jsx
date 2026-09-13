import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";

function Navbar({ user, onMenu, onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const name = user?.name || "Candidate";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    onSignOut?.();
  };

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-40
        h-[74px]
        border-b
        border-[#1a2b44]
        bg-[#070f1c]/95
        backdrop-blur
        md:left-[250px]
      "
    >
      <div className="flex h-full min-w-0 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open navigation menu"
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-lg
              text-[#7c94b1]
              transition-colors
              hover:bg-white/[0.05]
              hover:text-slate-200
              md:hidden
            "
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <div className="flex min-w-0 items-center gap-2 text-[11px]">
            <span className="hidden text-[#5f7795] sm:inline">
              Workspace
            </span>

            <span className="hidden text-[#334c6b] sm:inline">
              /
            </span>

            <strong className="truncate font-medium text-[#b6cbe4]">
              Dashboard
            </strong>
          </div>
        </div>

        {/* Right side */}

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              text-[#7c94b1]
              transition-colors
              hover:bg-white/[0.05]
              hover:text-slate-200
            "
          >
            <Bell size={17} strokeWidth={1.8} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5fe3ff]" />
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-transparent
                px-2
                py-1.5
                transition-colors
                hover:border-[#1a2b44]
                hover:bg-white/[0.04]
              "
            >
              <span
                className="
                  grid
                  h-8
                  w-8
                  shrink-0
                  place-items-center
                  rounded-lg
                  bg-[#17364b]
                  text-[11px]
                  font-semibold
                  text-[#a9edff]
                "
              >
                {initials}
              </span>

              <span className="hidden max-w-[130px] truncate text-[11px] text-[#c8d9ea] sm:block">
                {name}
              </span>

              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className="text-[#68809e]"
              />
            </button>

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-56
                  rounded-xl
                  border
                  border-[#1a2b44]
                  bg-[#0b1a2b]
                  p-2
                  shadow-2xl
                "
              >
                <div className="border-b border-[#1a2b44] px-3 py-3">
                  <p className="truncate text-[12px] font-medium text-[#dceaff]">
                    {name}
                  </p>

                  <p className="mt-1 text-[10px] text-[#7188a3]">
                    Personal workspace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-2.5
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-[11px]
                    text-[#a5b9cd]
                    transition-colors
                    hover:bg-rose-400/[0.06]
                    hover:text-rose-300
                  "
                >
                  <LogOut size={15} strokeWidth={1.8} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
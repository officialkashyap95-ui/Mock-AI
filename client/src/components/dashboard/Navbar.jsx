import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Sparkles,
  User,
} from "lucide-react";

function Navbar({ user, onMenu, onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const name = user?.name || "Candidate";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        h-[76px]
        border-b
        border-cyan-400/10
        bg-[#020b18]/95
        backdrop-blur-xl
        lg:left-[250px]
      "
    >

      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              border
              border-[#19334a]
              bg-[#061525]
              text-slate-400
              transition
              hover:border-cyan-400/20
              hover:text-cyan-300
              lg:hidden
            "
          >
            <Menu size={18} />
          </button>

          <div
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              border
              border-cyan-400/15
              bg-cyan-400/[0.05]
              text-cyan-300
            "
          >
            <Sparkles size={17} />
          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              mock <span className="text-cyan-400">AI</span>
            </p>

            <p
              className="
                hidden
                font-mono
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-slate-600
                sm:block
              "
            >
              AI Interview Workspace
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3 sm:gap-5">

          {/* NOTIFICATION */}

          <button
            type="button"
            className="
              relative
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-white/[0.025]
              hover:text-cyan-300
            "
          >

            <Bell size={17} />

            <span
              className="
                absolute
                right-2
                top-2
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-300
                shadow-[0_0_7px_rgba(34,211,238,.8)]
              "
            />

          </button>

          <div className="hidden h-8 w-px bg-[#19334a] sm:block" />

          {/* PROFILE */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setProfileOpen((value) => !value)
              }
              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-1.5
                py-1.5
                transition
                hover:bg-white/[0.025]
              "
            >

              <div
                className="
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-full
                  border
                  border-cyan-400/30
                  bg-cyan-400/[0.07]
                "
              >
                <span className="text-xs font-semibold text-cyan-300">
                  {initials}
                </span>
              </div>

              <div className="hidden text-left sm:block">

                <p className="text-xs font-medium text-slate-200">
                  {name}
                </p>

                <p
                  className="
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  Candidate
                </p>

              </div>

              <ChevronDown
                size={14}
                className={`
                  hidden
                  text-slate-600
                  transition-transform
                  sm:block
                  ${profileOpen ? "rotate-180" : ""}
                `}
              />

            </button>

            {/* DROPDOWN */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  w-52
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#1b3851]
                  bg-[#061525]
                  p-1.5
                  shadow-[0_20px_50px_rgba(0,0,0,.4)]
                "
              >

                <div className="border-b border-[#19334a] px-3 py-2.5">

                  <p className="text-xs font-medium text-white">
                    {name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Candidate account
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onSignOut?.();
                  }}
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
                    text-xs
                    text-slate-500
                    transition
                    hover:bg-red-500/[0.05]
                    hover:text-red-300
                  "
                >
                  <LogOut size={15} />
                  Sign out
                </button>

              </div>
            )}

          </div>

          {/* DESKTOP LOGOUT */}

          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            className="
              hidden
              h-9
              w-9
              place-items-center
              rounded-lg
              border
              border-red-400/15
              bg-red-500/[0.04]
              text-red-400/70
              transition
              hover:border-red-400/30
              hover:bg-red-500/[0.08]
              hover:text-red-300
              lg:grid
            "
          >
            <LogOut size={16} />
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;
import {
  BarChart3,
  FileClock,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { useLocation } from "react-router-dom";

function Sidebar({
  open = false,
  onClose = () => {},
  onSignOut = () => {},
  navigation = [],
  onNavigate = () => {},
}) {
  const location = useLocation();

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-[55]
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-[76px]
          z-[60]
          flex
          h-[calc(100vh-76px)]
          w-[250px]
          shrink-0
          flex-col
          overflow-hidden
          border-r
          border-[#183149]
          bg-[#061525]

          transition-transform
          duration-300
          ease-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* =====================================================
            SIDEBAR INNER
        ===================================================== */}

        <div className="flex min-h-0 flex-1 flex-col">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="border-b border-[#10283d] px-5 py-6">

            <div className="flex items-center gap-3">

              {/* Logo */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-300/20
                  bg-gradient-to-br
                  from-cyan-300
                  to-blue-500
                  text-[#03101d]
                  shadow-[0_0_25px_rgba(34,211,238,.18)]
                "
              >
                <Sparkles
                  size={18}
                  strokeWidth={2}
                />
              </div>

              {/* Brand */}

              <div className="min-w-0">

                <div className="text-[17px] font-semibold tracking-[-0.03em] text-white">
                  mock<span className="text-cyan-300">AI</span>
                </div>

                <div
                  className="
                    mt-0.5
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-slate-500
                  "
                >
                  Candidate Workspace
                </div>

              </div>

              {/* Mobile close */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="
                  ml-auto
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-white/[0.04]
                  hover:text-white
                  lg:hidden
                "
              >
                <X size={17} />
              </button>

            </div>

          </div>

          {/* =================================================
              WORKSPACE NAVIGATION
          ================================================= */}

          <div className="px-4 pt-7">

            <div
              className="
                mb-3
                px-2
                font-mono
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-cyan-300
              "
            >
              Workspace
            </div>

            <nav className="space-y-1">

              {navigation.map((item) => {

                const Icon = item.icon;

                const active =
                  location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    className={`
                      group
                      relative
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            border
                            border-cyan-300/10
                            bg-cyan-300/[0.08]
                            text-cyan-200
                            shadow-[inset_0_0_25px_rgba(34,211,238,.025)]
                          `
                          : `
                            border
                            border-transparent
                            text-slate-500
                            hover:border-cyan-300/[0.05]
                            hover:bg-white/[0.025]
                            hover:text-slate-200
                          `
                      }
                    `}
                  >

                    {/* Active indicator */}

                    {active && (
                      <span
                        className="
                          absolute
                          left-0
                          top-2
                          h-[calc(100%-16px)]
                          w-[2px]
                          rounded-full
                          bg-cyan-300
                          shadow-[0_0_12px_rgba(34,211,238,.8)]
                        "
                      />
                    )}

                    {/* Icon */}

                    <span
                      className={`
                        grid
                        h-8
                        w-8
                        shrink-0
                        place-items-center
                        rounded-lg
                        transition
                        ${
                          active
                            ? "bg-cyan-300/10 text-cyan-300"
                            : "text-slate-500 group-hover:text-cyan-300"
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    {/* Label */}

                    <span
                      className={`
                        text-[13px]
                        ${
                          active
                            ? "font-medium"
                            : "font-normal"
                        }
                      `}
                    >
                      {item.name}
                    </span>

                  </button>
                );
              })}

            </nav>

          </div>

          {/* =================================================
              FLEXIBLE SPACE
          ================================================= */}

          <div className="flex-1" />

          {/* =================================================
              AI STATUS
          ================================================= */}

          <div className="px-4">

            <div
              className="
                rounded-xl
                border
                border-cyan-300/10
                bg-cyan-300/[0.035]
                p-4
              "
            >

              <div className="flex items-center gap-2">

                <span className="relative flex h-2 w-2">

                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-cyan-300
                      opacity-60
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-cyan-300
                    "
                  />

                </span>

                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.13em]
                    text-cyan-300
                  "
                >
                  AI Interviewer Online
                </span>

              </div>

              <p className="mt-2 text-[10px] leading-5 text-slate-600">
                Ready for your next practice session.
              </p>

            </div>

          </div>

          {/* =================================================
              DAILY GOAL
          ================================================= */}

          <div className="px-4 pt-3">

            <div
              className="
                rounded-xl
                border
                border-[#183149]
                bg-[#081827]
                p-4
              "
            >

              <div className="mb-3 flex items-center justify-between">

                <span
                  className="
                    font-mono
                    text-[9px]
                    uppercase
                    tracking-[0.22em]
                    text-slate-500
                  "
                >
                  Daily Goal
                </span>

                <Target
                  size={15}
                  className="text-cyan-300"
                />

              </div>

              <div className="flex items-end justify-between">

                <div>

                  <span className="text-xl font-semibold tracking-tight text-white">
                    2
                  </span>

                  <span className="ml-1 text-[10px] text-slate-600">
                    / 3 interviews
                  </span>

                </div>

                <span className="font-mono text-[10px] text-cyan-300">
                  67%
                </span>

              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#12263a]">

                <div
                  className="
                    h-full
                    w-[67%]
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-300
                    to-blue-500
                    shadow-[0_0_10px_rgba(34,211,238,.2)]
                  "
                />

              </div>

            </div>

          </div>

          {/* =================================================
              SIGN OUT
          ================================================= */}

          <div className="p-4">

            <button
              type="button"
              onClick={onSignOut}
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                text-slate-500
                transition
                hover:bg-red-400/[0.04]
                hover:text-red-300
              "
            >

              <span
                className="
                  grid
                  h-8
                  w-8
                  place-items-center
                  rounded-lg
                  border
                  border-transparent
                  transition
                  group-hover:border-red-400/10
                  group-hover:bg-red-400/[0.05]
                "
              >
                <LogOut
                  size={16}
                  strokeWidth={1.8}
                />
              </span>

              <span className="text-[12px]">
                Sign out
              </span>

            </button>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;
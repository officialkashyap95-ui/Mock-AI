import {
  BarChart3,
  ChevronDown,
  FileClock,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 text-[#f0f7ff]">
      <span
        className="
          relative
          grid
          h-[23px]
          w-[23px]
          shrink-0
          rotate-[28deg]
          place-items-center
          rounded-full
          border-[1.5px]
          border-[#5fe3ff]
        "
      >
        <span className="absolute -top-[2px] left-[5px] h-1 w-1 rounded-full bg-[#5fe3ff]" />
        <span className="absolute bottom-[1px] right-[1px] h-[3px] w-[3px] rounded-full bg-[#5fe3ff]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#5fe3ff]" />
      </span>

      <span className="text-[20px] font-bold leading-none tracking-[-0.03em]">
        mock<span className="text-[#5fe3ff]">ai</span>
      </span>
    </div>
  );
}

function Sidebar({
  open = false,
  onClose = () => {},
  onSignOut = () => {},
  navigation = [],
  onNavigate = () => {},
  user = null,
}) {
  const location = useLocation();

  const defaultNavigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Interview History",
      icon: FileClock,
      path: "/history",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const items = navigation.length
    ? navigation
    : defaultNavigation;

  const name = user?.name || "Candidate";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleNavigate = (path) => {
    onNavigate(path);
    onClose();
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <>
      {/* Mobile overlay */}

      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/65
            md:hidden
          "
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          left-0
          top-[74px]
          z-50
          flex
          h-[calc(100vh-74px)]
          w-[250px]
          flex-col
          border-r
          border-[#1a2b44]
          bg-[#08111f]
          transition-transform
          duration-300
          ease-out
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Sidebar header */}

        <div
          className="
            flex
            h-[64px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#1a2b44]/70
            px-6
          "
        >
          <BrandMark />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              grid
              h-8
              w-8
              place-items-center
              rounded-lg
              text-[#7c94b1]
              transition-colors
              hover:bg-white/[0.05]
              hover:text-slate-200
              md:hidden
            "
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* Scrollable sidebar content */}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Workspace card */}

          <div
            className="
              mx-4
              mt-5
              flex
              items-center
              gap-2.5
              rounded-lg
              border
              border-[#1a2b44]
              bg-[#12243a]/70
              p-2.5
            "
          >
            <span
              className="
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                rounded-lg
                bg-[#5fe3ff]
                text-sm
                font-bold
                text-[#07101e]
              "
            >
              {initials}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-[#d8e6f8]">
                {name}
              </p>

              <p className="mt-1 text-[10px] text-[#7588a5]">
                Personal workspace
              </p>
            </div>

            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className="shrink-0 text-[#68809e]"
            />
          </div>

          {/* Navigation */}

          <nav className="mt-7 px-3">
            <p
              className="
                mb-3
                px-3
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#536d8b]
              "
            >
              Workspace
            </p>

            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      group
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      border
                      px-3
                      py-3
                      text-left
                      transition-colors
                      ${
                        active
                          ? "border-[#24516a] bg-[#123047] text-[#e8faff]"
                          : "border-transparent text-[#7d96b2] hover:border-[#1a2b44] hover:bg-[#0e2033] hover:text-[#dcecff]"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={active ? 2 : 1.7}
                      className={
                        active
                          ? "text-[#5fe3ff]"
                          : "text-[#68829e] group-hover:text-[#9bb9d4]"
                      }
                    />

                    <span className="text-[12px] font-medium">
                      {item.name}
                    </span>

                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5fe3ff]" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* System status */}

          <div className="mt-8 px-4">
            <div
              className="
                rounded-lg
                border
                border-[#1a2b44]
                bg-[#0b1a2b]
                p-3
              "
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-emerald-300"
                  strokeWidth={1.8}
                />

                <span className="text-[10px] font-semibold text-[#c8d9ea]">
                  AI Interview Engine
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                <span className="text-[10px] text-emerald-300">
                  System operational
                </span>
              </div>

              <p className="mt-2 text-[10px] leading-relaxed text-[#647e9c]">
                Your interview environment is ready for your next practice
                session.
              </p>
            </div>
          </div>

          {/* Daily goal */}

          <div className="mt-4 px-4">
            <div className="rounded-lg border border-[#1a2b44] bg-[#0b1a2b] p-3">
              <div className="flex items-center gap-2">
                <Target
                  size={15}
                  strokeWidth={1.8}
                  className="text-[#6fa9c9]"
                />

                <span className="text-[10px] font-semibold text-[#c8d9ea]">
                  Daily goal
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1a2b44]">
                <div className="h-full w-[45%] rounded-full bg-[#4bc9e9]" />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#647e9c]">
                  Practice progress
                </span>

                <span className="text-[10px] font-medium text-[#a9c6dc]">
                  45%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar footer */}

        <div className="shrink-0 border-t border-[#1a2b44] p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-3
              text-left
              text-[#7d96b2]
              transition-colors
              hover:bg-rose-400/[0.06]
              hover:text-rose-300
            "
          >
            <LogOut size={17} strokeWidth={1.8} />

            <span className="text-[12px] font-medium">
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
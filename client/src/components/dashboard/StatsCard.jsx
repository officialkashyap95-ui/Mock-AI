import { ArrowUpRight } from "lucide-react";

const TONES = {
  cyan: {
    iconText: "text-[#5fe3ff]",
    iconBg: "bg-[#5fe3ff]/[0.12]",
    line: "bg-[#5fe3ff]",
    trend: "text-[#5fe3ff]",
  },
  blue: {
    iconText: "text-[#4d8dff]",
    iconBg: "bg-[#4d8dff]/[0.12]",
    line: "bg-[#4d8dff]",
    trend: "text-[#4d8dff]",
  },
  indigo: {
    iconText: "text-[#9a8cff]",
    iconBg: "bg-[#9a8cff]/[0.12]",
    line: "bg-[#9a8cff]",
    trend: "text-[#9a8cff]",
  },
  purple: {
    iconText: "text-[#9a8cff]",
    iconBg: "bg-[#9a8cff]/[0.12]",
    line: "bg-[#9a8cff]",
    trend: "text-[#9a8cff]",
  },
  green: {
    iconText: "text-[#5de5ad]",
    iconBg: "bg-[#5de5ad]/[0.12]",
    line: "bg-[#5de5ad]",
    trend: "text-[#5de5ad]",
  },
};

function StatsCard({
  title,
  value,
  detail,
  trend,
  icon,
  tone = "cyan",
}) {
  const current = TONES[tone] || TONES.cyan;

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-[#1a2b44]
        bg-[#0b1424]
        p-[17px]
        pb-[15px]
        transition-colors
        duration-200
        hover:border-[#24466b]
      "
    >
      {/* HEADING ROW */}

      <div
        className="
          flex
          items-center
          gap-2
          text-[#758aa6]
        "
      >
        <div
          className={`
            grid
            h-6
            w-6
            shrink-0
            place-items-center
            rounded-md
            ${current.iconBg}
            ${current.iconText}
          `}
        >
          {icon}
        </div>

        <span className="text-[10px]">
          {title}
        </span>

        <ArrowUpRight
          size={13}
          strokeWidth={1.8}
          className="ml-auto shrink-0 text-[#5a7692]"
        />
      </div>

      {/* VALUE */}

      <strong
        className="
          mt-[11px]
          block
          text-[23px]
          font-semibold
          leading-none
          tracking-[-0.04em]
          text-[#e4f0ff]
        "
      >
        {value}
      </strong>

      {/* DETAIL + TREND */}

      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          gap-2
        "
      >
        {detail && (
          <span className="truncate text-[9px] text-[#617b98]">
            {detail}
          </span>
        )}

        {trend && (
          <span
            className={`
              shrink-0
              truncate
              text-[9px]
              font-medium
              ${current.trend}
            `}
          >
            {trend}
          </span>
        )}
      </div>

      {/* BOTTOM ACCENT LINE */}

      <span
        className={`
          absolute
          inset-x-0
          bottom-0
          h-[2px]
          opacity-75
          ${current.line}
        `}
      />
    </article>
  );
}

export default StatsCard;
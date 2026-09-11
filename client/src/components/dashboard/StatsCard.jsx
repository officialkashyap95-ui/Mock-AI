function StatsCard({
  title,
  value,
  detail,
  trend,
  icon,
  tone = "cyan",
}) {
  const tones = {
    cyan: {
      icon:
        "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300",
      hover:
        "hover:border-cyan-300/25 hover:shadow-[0_12px_35px_rgba(34,211,238,.05)]",
    },

    blue: {
      icon:
        "border-blue-400/15 bg-blue-400/[0.06] text-blue-300",
      hover:
        "hover:border-blue-400/25 hover:shadow-[0_12px_35px_rgba(59,130,246,.05)]",
    },

    indigo: {
      icon:
        "border-indigo-400/15 bg-indigo-400/[0.06] text-indigo-300",
      hover:
        "hover:border-indigo-400/25 hover:shadow-[0_12px_35px_rgba(99,102,241,.05)]",
    },

    green: {
      icon:
        "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
      hover:
        "hover:border-emerald-400/25 hover:shadow-[0_12px_35px_rgba(16,185,129,.05)]",
    },
  };

  const current = tones[tone] || tones.cyan;

  return (
    <article
      className={`
        group
        relative
        min-h-[160px]
        overflow-hidden
        rounded-[14px]
        border
        border-[#18364e]
        bg-[#061525]
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#07192a]
        ${current.hover}
      `}
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-28
          w-28
          rounded-full
          bg-cyan-400/[0.025]
          blur-2xl
        "
      />

      <div className="relative">

        {/* TOP */}

        <div className="flex items-start justify-between">

          <div
            className={`
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              border
              ${current.icon}
            `}
          >
            {icon}
          </div>

          {trend && (
            <span
              className="
                max-w-[100px]
                truncate
                text-right
                font-mono
                text-[8px]
                uppercase
                tracking-[0.08em]
                text-emerald-300
              "
            >
              {trend}
            </span>
          )}

        </div>

        {/* TITLE */}

        <p
          className="
            mt-5
            font-mono
            text-[9px]
            uppercase
            tracking-[0.22em]
            text-cyan-300
          "
        >
          {title}
        </p>

        {/* VALUE */}

        <div className="mt-2 flex items-baseline gap-2">

          <strong
            className="
              text-3xl
              font-semibold
              tracking-[-0.06em]
              text-white
            "
          >
            {value}
          </strong>

          {detail && (
            <span className="text-[10px] text-slate-600">
              {detail}
            </span>
          )}

        </div>

        {/* LINE */}

        <div
          className="
            mt-4
            h-px
            bg-gradient-to-r
            from-cyan-400/15
            via-cyan-400/5
            to-transparent
          "
        />

      </div>

    </article>
  );
}

export default StatsCard;
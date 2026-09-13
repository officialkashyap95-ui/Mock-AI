import {
  ArrowUpRight,
  History,
  Loader2,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const DIFFICULTY_STYLES = {
  easy: "text-[#5fe3ff] bg-[#5fe3ff]/[0.12]",
  medium: "text-[#9a8cff] bg-[#9a8cff]/[0.11]",
  hard: "text-[#4d8dff] bg-[#4d8dff]/[0.12]",
};

const STATUS_STYLES = {
  completed: "text-[#5de5ad]",
  pending: "text-amber-300",
  "in progress": "text-amber-300",
  exited: "text-[#7188a4]",
  cancelled: "text-[#7188a4]",
  canceled: "text-[#7188a4]",
  failed: "text-red-300",
};

function statusClass(status) {
  return (
    STATUS_STYLES[String(status || "").toLowerCase()] ||
    "text-amber-300"
  );
}

function RecentInterviews({
  interviews = [],
  loading = false,
  onRefresh,
}) {
  const list = Array.isArray(interviews)
    ? interviews.slice(0, 5)
    : [];

  return (
    <section
      className="
        rounded-[9px]
        border
        border-[#1a2b44]
        bg-[#0b1424]
        p-[22px]
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between">
        <div>
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#66809f]
            "
          >
            Your Activity
          </span>

          <h3
            className="
              mt-1.5
              text-[15px]
              font-semibold
              tracking-[-0.02em]
              text-[#dceaff]
            "
          >
            Recent interviews
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh interviews"
              aria-label="Refresh interviews"
              className="
                grid
                h-7
                w-7
                place-items-center
                rounded-md
                text-[#5f7692]
                transition-colors
                hover:bg-white/[0.05]
                hover:text-[#dceaff]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <RefreshCw
                size={13}
                strokeWidth={1.8}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          )}

          <button
            type="button"
            className="
              hidden
              items-center
              gap-[5px]
              rounded-md
              px-2
              py-1
              text-[10px]
              text-[#5fe3ff]
              transition-colors
              hover:bg-white/[0.05]
              sm:flex
            "
          >
            View all

            <ArrowUpRight size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div
          className="
            flex
            min-h-[280px]
            items-center
            justify-center
            text-xs
            text-[#7189a5]
          "
        >
          <Loader2
            size={17}
            strokeWidth={1.8}
            className="mr-2 animate-spin text-[#5fe3ff]"
          />
          Loading interviews...
        </div>
      ) : list.length === 0 ? (
        /* EMPTY STATE */

        <div
          className="
            flex
            min-h-[280px]
            flex-col
            items-center
            justify-center
            px-4
            text-center
          "
        >
          <div
            className="
              grid
              h-12
              w-12
              place-items-center
              rounded-xl
              border
              border-[#1a2b44]
              bg-[#0e192b]
              text-[#5f7692]
            "
          >
            <History size={21} strokeWidth={1.7} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-300">
            No interviews yet
          </h3>

          <p className="mt-2 max-w-[240px] text-[11px] leading-5 text-[#5c7693]">
            Start your first AI interview to begin building
            your performance history.
          </p>
        </div>
      ) : (
        /* LIST */

        <div className="mt-[19px] flex flex-col">
          {list.map((interview, index) => {
            const status = String(
              interview?.status || "Pending"
            );

            const score =
              typeof interview?.score === "number"
                ? interview.score
                : null;

            const difficultyKey = String(
              interview?.difficulty || "medium"
            ).toLowerCase();

            const difficultyClass =
              DIFFICULTY_STYLES[difficultyKey] ||
              DIFFICULTY_STYLES.medium;

            return (
              <article
                key={
                  interview?._id ||
                  interview?.id ||
                  index
                }
                className="
                  flex
                  items-center
                  gap-[11px]
                  border-t
                  border-[#1a2b44]
                  py-[13px]
                  first:border-t-0
                "
              >
                {/* SYMBOL */}

                <div
                  className="
                    grid
                    h-[30px]
                    w-[30px]
                    shrink-0
                    place-items-center
                    rounded-md
                    border
                    border-[#214466]
                    bg-[#102239]
                    text-[#77bde1]
                  "
                >
                  <MessageSquareText size={14} strokeWidth={1.8} />
                </div>

                {/* INFO */}

                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[10px] font-semibold text-[#c8d9eb]">
                    {interview?.role || "Mock Interview"}
                  </strong>

                  <span className="mt-1 block truncate text-[9px] text-[#7188a4]">
                    {interview?.technology || "General"}
                    <span className="mx-1.5 text-[#334c6b]">
                      •
                    </span>
                    <span className={statusClass(status)}>
                      {status}
                    </span>
                  </span>

                  <small className="mt-1 block truncate text-[8px] text-[#506a88]">
                    {formatDate(interview?.createdAt)}
                  </small>
                </div>

                {/* META */}

                <div className="flex shrink-0 items-center gap-[13px]">
                  <span
                    className={`
                      hidden
                      rounded
                      px-[7px]
                      py-1
                      text-[8px]
                      sm:inline-block
                      ${difficultyClass}
                    `}
                  >
                    {interview?.difficulty || "Medium"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {score !== null ? (
                      <div
                        className="relative grid h-[27px] w-[27px] place-items-center rounded-full"
                        style={{
                          background: `conic-gradient(#5fe3ff ${Math.max(
                            0,
                            Math.min(100, score)
                          ) * 3.6}deg, #1a2d45 0deg)`,
                        }}
                      >
                        <div className="absolute inset-[3px] rounded-full bg-[#0b1424]" />

                        <span className="relative z-10 text-[8px] text-[#d9f8ff]">
                          {score}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-[#5c7693]">
                        —
                      </span>
                    )}

                    <small className="hidden text-[8px] text-[#5c7693] sm:inline">
                      score
                    </small>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* FOOTER */}

      {!loading && list.length > 0 && (
        <div className="mt-2 border-t border-[#1a2b44] pt-3 text-center text-[9px] text-[#5c7693]">
          Practice history synced
        </div>
      )}
    </section>
  );
}

export default RecentInterviews;
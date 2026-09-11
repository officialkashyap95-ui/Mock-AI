import {
  Activity,
  ArrowUpRight,
  Check,
  History,
  Loader2,
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
        overflow-hidden
        rounded-[18px]
        border
        border-[#1b3851]
        bg-[#061525]
        shadow-[0_20px_60px_rgba(0,0,0,.14)]
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          border-b
          border-[#19334a]
          px-6
          py-6
          sm:px-7
        "
      >

        <div>

          <p
            className="
              font-mono
              text-[9px]
              uppercase
              tracking-[0.28em]
              text-cyan-300
            "
          >
            Practice Log
          </p>

          <h2
            className="
              mt-2
              text-[clamp(22px,2.2vw,30px)]
              font-semibold
              tracking-[-0.05em]
              text-[#dbe8f4]
            "
          >
            Recent Interviews
          </h2>

          <p className="mt-2 text-[11px] text-slate-600">
            Your latest AI interview sessions.
          </p>

        </div>

        <div className="flex items-center gap-2">

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh"
              className="
                grid
                h-8
                w-8
                place-items-center
                rounded-lg
                border
                border-[#19334a]
                text-slate-600
                transition
                hover:border-cyan-400/20
                hover:text-cyan-300
              "
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          )}

          <button
            type="button"
            className="
              hidden
              items-center
              gap-1
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-cyan-300
              transition
              hover:text-cyan-200
              sm:flex
            "
          >
            View All
            <ArrowUpRight size={13} />
          </button>

        </div>

      </div>

      {/* LOADING */}

      {loading ? (
        <div
          className="
            flex
            min-h-[340px]
            items-center
            justify-center
            text-xs
            text-slate-600
          "
        >

          <Loader2
            size={17}
            className="mr-2 animate-spin text-cyan-300"
          />

          Loading interviews...

        </div>
      ) : list.length === 0 ? (

        /* EMPTY */

        <div
          className="
            flex
            min-h-[340px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >

          <div
            className="
              grid
              h-14
              w-14
              place-items-center
              rounded-2xl
              border
              border-[#19334a]
              bg-[#081a2d]
              text-cyan-300
            "
          >
            <History size={22} />
          </div>

          <h3 className="mt-5 text-sm font-semibold text-slate-300">
            No interviews yet
          </h3>

          <p
            className="
              mt-2
              max-w-[240px]
              text-[10px]
              leading-5
              text-slate-600
            "
          >
            Start your first AI interview to begin building
            your performance history.
          </p>

        </div>

      ) : (

        /* LIST */

        <div className="px-5">

          {list.map((interview, index) => {

            const status =
              String(
                interview?.status || "Pending"
              );

            const completed =
              status.toLowerCase() ===
              "completed";

            const score =
              typeof interview?.score === "number"
                ? interview.score
                : null;

            return (
              <div
                key={
                  interview?._id ||
                  interview?.id ||
                  index
                }
                className="
                  group
                  flex
                  items-center
                  gap-3
                  border-b
                  border-[#19334a]
                  py-5
                  transition
                  last:border-b-0
                  hover:bg-cyan-300/[0.015]
                "
              >

                {/* STATUS */}

                <div
                  className={`
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-full
                    border

                    ${
                      completed
                        ? `
                          border-emerald-400/20
                          bg-emerald-400/[0.07]
                          text-emerald-300
                        `
                        : `
                          border-amber-400/20
                          bg-amber-400/[0.07]
                          text-amber-300
                        `
                    }
                  `}
                >
                  {completed ? (
                    <Check size={15} />
                  ) : (
                    <Activity size={15} />
                  )}
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                  <strong
                    className="
                      block
                      truncate
                      text-[13px]
                      font-semibold
                      text-slate-200
                    "
                  >
                    {interview?.role ||
                      "Mock Interview"}
                  </strong>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">

                    <span
                      className="
                        font-mono
                        text-[9px]
                        uppercase
                        tracking-[0.06em]
                        text-cyan-300
                      "
                    >
                      {interview?.technology ||
                        "General"}
                    </span>

                    <span className="text-slate-700">
                      •
                    </span>

                    <small
                      className="
                        font-mono
                        text-[9px]
                        tracking-[0.03em]
                        text-slate-600
                      "
                    >
                      {interview?.difficulty ||
                        "Medium"}
                    </small>

                    <span className="text-slate-700">
                      •
                    </span>

                    <small
                      className={`
                        font-mono
                        text-[9px]
                        ${
                          completed
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }
                      `}
                    >
                      {status}
                    </small>

                  </div>

                  <small className="mt-2 block text-[9px] text-slate-700">
                    {formatDate(
                      interview?.createdAt
                    )}
                  </small>

                </div>

                {/* SCORE */}

                <div className="shrink-0 text-right">

                  {score !== null ? (
                    <>
                      <div className="flex items-baseline justify-end gap-1">

                        <strong
                          className="
                            text-[22px]
                            font-semibold
                            tracking-[-0.06em]
                            text-slate-100
                          "
                        >
                          {score}
                        </strong>

                        <small className="font-mono text-[9px] text-slate-600">
                          /100
                        </small>

                      </div>

                      <div
                        className="
                          mt-2
                          h-[3px]
                          w-12
                          overflow-hidden
                          rounded-full
                          bg-[#18364d]
                        "
                      >
                        <span
                          className={`
                            block
                            h-full
                            rounded-full
                            ${
                              completed
                                ? "bg-cyan-300"
                                : "bg-amber-300"
                            }
                          `}
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                score
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <strong className="text-xl font-semibold text-amber-300">
                      —
                    </strong>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* FOOTER */}

      {!loading && list.length > 0 && (
        <div
          className="
            border-t
            border-dashed
            border-[#19334a]
            px-5
            py-3
            text-center
            font-mono
            text-[8px]
            uppercase
            tracking-[0.25em]
            text-slate-700
          "
        >
          Practice history synced
        </div>
      )}

    </section>
  );
}

export default RecentInterviews;
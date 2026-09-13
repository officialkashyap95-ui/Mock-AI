import { Loader2 } from "lucide-react";

const variants = {
  primary: `
    border border-cyan-300/20
    bg-cyan-400
    text-[#03101d]
    hover:bg-cyan-300
    active:bg-cyan-400
  `,

  secondary: `
    border border-[#24445d]
    bg-[#0a1b2d]
    text-[#dbe8f4]
    hover:border-cyan-400/30
    hover:bg-[#0d2237]
  `,

  ghost: `
    border border-transparent
    bg-transparent
    text-slate-400
    hover:bg-white/[0.03]
    hover:text-slate-200
  `,

  danger: `
    border border-red-400/15
    bg-red-500/10
    text-red-300
    hover:bg-red-500/15
    hover:border-red-400/25
  `,
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        rounded-lg
        font-medium
        transition-colors
        duration-150
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400/40
        disabled:pointer-events-none
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}

      {children}
    </button>
  );
}

export default Button;
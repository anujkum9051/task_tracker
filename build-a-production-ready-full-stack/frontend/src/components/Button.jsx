const variants = {
  primary: 'bg-brand text-white hover:bg-[#12566d]',
  secondary: 'border border-line bg-white text-ink hover:bg-surface',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-ink hover:bg-surface'
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

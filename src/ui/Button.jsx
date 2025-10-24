function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`cursor-pointer inline-flex items-center justify-center rounded px-4 py-2 font-medium
                  bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;

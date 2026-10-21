"use client";

interface ScrollToCalculatorButtonProps {
  className?: string;
  children: React.ReactNode;
  targetId?: string;
  ariaLabel?: string;
}

export function ScrollToCalculatorButton({
  className,
  children,
  targetId = "quote-calculator",
  ariaLabel,
}: ScrollToCalculatorButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

import Link from "next/link";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  href, 
  children, 
  variant = "primary",
  size = "default",
  type = "button",
  onClick,
  className = ""
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(0,83%,59%)] gap-2";
  
  const sizeStyles = {
    default: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg",
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl hover:shadow-red-200/50",
    secondary: "bg-white text-[hsl(0,83%,59%)] border-2 border-[hsl(0,83%,59%)] hover:bg-[hsl(0,83%,59%)] hover:text-white hover:shadow-lg"
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}

import Link from "next/link";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  href, 
  children, 
  variant = "primary",
  type = "button",
  onClick,
  className = ""
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[hsl(0,83%,59%)] to-[hsl(0,83%,49%)] text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white text-[hsl(0,83%,59%)] border-2 border-[hsl(0,83%,59%)] hover:bg-[hsl(0,83%,59%)] hover:text-white"
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}

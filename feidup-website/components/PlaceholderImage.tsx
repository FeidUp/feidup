interface PlaceholderImageProps {
  text: string;
  className?: string;
}

export default function PlaceholderImage({ text, className = "" }: PlaceholderImageProps) {
  return (
    <div className={`bg-gradient-to-br from-[hsl(14,86%,57%)] to-[hsl(14,86%,47%)] rounded-3xl flex items-center justify-center ${className}`}>
      <div className="text-center p-8">
        <svg 
          className="w-24 h-24 mx-auto mb-4 text-white opacity-50" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="text-white font-semibold text-lg opacity-75">{text}</p>
      </div>
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded transition
        bg-gray-200 text-gray-800 
        dark:bg-gray-800 dark:text-white 
        hover:bg-gray-300 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {children}
    </button>
  );
}

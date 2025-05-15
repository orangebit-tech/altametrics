export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm py-4">
      <div className="text-center">
        © {new Date().getFullYear()} Demo App · Built with ❤️ using React & NestJS
      </div>
    </footer>
  );
}

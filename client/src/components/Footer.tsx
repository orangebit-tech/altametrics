export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Altametrics · Demo App · Built with ❤️ using React & NestJS
      </div>
    </footer>
  );
}

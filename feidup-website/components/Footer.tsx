import Link from "next/link";

export default function Footer() {
  const navigation = {
    main: [
      { name: "About", href: "/about" },
      { name: "Advertisers", href: "/advertisers" },
      { name: "Café Partners", href: "/businesses" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} FeidUp. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Transforming everyday café packaging into high-visibility ad inventory.
          </p>
        </div>
      </div>
    </footer>
  );
}

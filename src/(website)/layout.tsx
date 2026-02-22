export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl font-bold">AdvanceMosque</h1>
      </header>

      <main className=" min-h-screen bg-gray-50">
        {children}
      </main>

      <footer className="p-4 bg-gray-100 text-center">
        © 2026 AdvanceMosque
      </footer>
    </div>
  );
}

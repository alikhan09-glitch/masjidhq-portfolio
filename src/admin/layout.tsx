export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mosqueName = "Masjid Al-Noor";
  const adminName = "Demo Admin";
  const role = "Super Admin";

  return (
    <AdminLayoutShell
      mosqueName={mosqueName}
      adminName={adminName}
      role={role}
    >
      {children}
    </AdminLayoutShell>
  );
}
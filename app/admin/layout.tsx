import type { Metadata } from 'next';

// Every admin route: never indexed, never cached by a shared cache.
export const metadata: Metadata = {
  title: 'Sales desk admin — The Buggies Express',
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#071527] text-white antialiased">{children}</div>;
}

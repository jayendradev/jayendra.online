import { AdminMessages } from "@/components/AdminMessages";
import { PageHeader } from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <PageHeader
        title="Admin inbox"
        description="View client messages and send replies."
      />
      <AdminMessages />
    </div>
  );
}

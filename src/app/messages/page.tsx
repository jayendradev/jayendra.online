import { AttachmentEmailNote } from "@/components/AttachmentEmailNote";
import { PageHeader } from "@/components/PageHeader";
import { UserMessages } from "@/components/UserMessages";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Messages",
    description:
      "Send a project message, view replies, and continue the conversation with Jayendra.",
    path: "/messages",
  }),
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <PageHeader
        title="Messages"
        description="Verify your email with a one-time code, then send your project message."
      />
      <AttachmentEmailNote className="mb-6" />
      <UserMessages />
    </div>
  );
}

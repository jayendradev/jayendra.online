import { site } from "@/lib/site";

type Props = {
  className?: string;
};

export function AttachmentEmailNote({ className = "" }: Props) {
  return (
    <p className={`text-sm text-foreground-secondary ${className}`.trim()}>
      Need to send files? Email{" "}
      <a href={`mailto:${site.email}`} className="text-accent hover:underline">
        {site.email}
      </a>{" "}
      with attachments (PDF, images, zip).
    </p>
  );
}

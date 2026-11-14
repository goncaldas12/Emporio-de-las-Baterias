import { track } from "../analytics.js";
import { whatsappHref, contactFormHref } from "../inquiries.js";

export function WhatsAppLink({
  inquiry,
  source = "general",
  children,
  ...props
}) {
  const href = whatsappHref(inquiry);
  // Retain the contact form as a fallback if WhatsApp is explicitly disabled.
  return (
    <a
      {...props}
      href={href || contactFormHref(inquiry)}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (href) track("whatsapp_click", { source });
      }}
    >
      {children}
    </a>
  );
}

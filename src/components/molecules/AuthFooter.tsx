import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

/**
 * Molecule: Auth Footer Component
 * Footer section for auth pages with link to other auth page
 */
export default function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <p className="text-center mt-6 text-gray-500">
      {text}{" "}
      <Link
        href={href}
        className="text-[#354e32] font-semibold hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}

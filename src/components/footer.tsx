import { motion } from "framer-motion";
import { useWeddingSiteOptional } from "@/context/site-context";

function joinMarqueeParts(parts: string[]): string {
  const cleaned = parts.map((p) => p.trim()).filter(Boolean);
  return cleaned.length ? cleaned.join("  ●  ") : "Thank you for celebrating with us";
}

export default function Footer() {
  const siteCtx = useWeddingSiteOptional();
  const c = siteCtx?.site?.content;
  const scrollText = joinMarqueeParts([
    c?.footerMarqueeLead ?? "",
    c?.footerPhone ?? "",
    c?.footerEmail ?? "",
    c?.footerCreditLine ?? "",
  ]);

  return (
    <footer className="py-4 bg-[var(--w-primary)] text-white overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex space-x-8 whitespace-nowrap text-xl font-serif"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 50 }, (_, i) => (
            <span key={i} className="inline-block">
              {scrollText}
              {"  ●  "}
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}

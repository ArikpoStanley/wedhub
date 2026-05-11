import { ScrollFade } from "@/components/scroll-fade";
import { Heart, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import ConfettiBackground from "@/components/confetti-background";
import ConfettiBurst from "@/components/confetti-burst";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { useWeddingSite } from "@/context/site-context";

const DEFAULT_GIFT_TITLE = "Would you like to gift us?";
const DEFAULT_GIFT_BODY =
  "Having you at our wedding is the best gift we could ask for but if you would like to bless us with a cash gift, we would truly appreciate it. Kindly find account details below.";
const DEFAULT_CLOSING_TITLE = "With Love & Gratitude";
const DEFAULT_CLOSING_BODY =
  "Your love, laughter, and presence mean everything to us as we start this beautiful journey together.";

export default function Registry() {
  const ws = useWeddingSite();
  const c = ws.site?.content;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const giftTitle = c?.registryGiftTitle?.trim() || DEFAULT_GIFT_TITLE;
  const giftBody = c?.registryGiftBody?.trim() || DEFAULT_GIFT_BODY;
  const accountHeading = c?.registryAccountHeading?.trim();
  const accountName = c?.registryAccountName?.trim();
  const accountNumber = c?.registryAccountNumber?.trim();
  const bankName = c?.registryBankName?.trim();
  const hasAccountBlock = Boolean(accountHeading || accountName || accountNumber || bankName);
  const closingTitle = c?.registryClosingTitle?.trim() || DEFAULT_CLOSING_TITLE;
  const closingBody = c?.registryClosingBody?.trim() || DEFAULT_CLOSING_BODY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--w-bg)] to-[color-mix(in_srgb,var(--w-accent)_15%,var(--w-bg))] relative">
      <ConfettiBackground />
      <ConfettiBurst />

      <NavigationBar currentPage="registry" />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <ScrollFade className="mx-auto mb-12 max-w-4xl" y={28} delay={0.12} duration={0.68}>
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-3xl font-serif text-[var(--w-primary)] mb-6 text-center">{giftTitle}</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">{giftBody}</p>

            <div className="max-w-lg mx-auto">
              {hasAccountBlock ? (
                <div className="bg-gradient-to-br from-[var(--w-border-soft)] to-[color-mix(in_srgb,var(--w-accent)_20%,var(--w-bg))] p-6 rounded-lg">
                  {accountHeading ? (
                    <h3 className="text-xl font-serif text-[var(--w-primary)] mb-4 text-center">{accountHeading}</h3>
                  ) : null}
                  <div className="space-y-3">
                    {accountName ? (
                      <div className="bg-white/80 p-3 rounded flex justify-between items-center gap-2">
                        <span className="text-sm text-gray-600 shrink-0">Account Name:</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">{accountName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(accountName, "acc-name")}
                            className="p-1 h-6 w-6 shrink-0"
                          >
                            {copiedField === "acc-name" ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                    {accountNumber ? (
                      <div className="bg-white/80 p-3 rounded flex justify-between items-center gap-2">
                        <span className="text-sm text-gray-600 shrink-0">Account Number:</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">{accountNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(accountNumber, "acc-num")}
                            className="p-1 h-6 w-6 shrink-0"
                          >
                            {copiedField === "acc-num" ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                    {bankName ? (
                      <div className="bg-white/80 p-3 rounded flex justify-between items-center gap-2">
                        <span className="text-sm text-gray-600 shrink-0">Bank:</span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">{bankName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(bankName, "acc-bank")}
                            className="p-1 h-6 w-6 shrink-0"
                          >
                            {copiedField === "acc-bank" ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 border border-dashed border-[var(--w-border-soft)] rounded-lg py-8 px-4">
                  Bank details are optional. Add them in <strong>Admin → Setup</strong> (Registry & payments).
                </p>
              )}
            </div>
          </Card>
        </ScrollFade>

        <ScrollFade className="text-center" y={26} duration={0.68}>
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[var(--w-primary)] rounded-full flex items-center justify-center">
                <Heart className="text-white text-2xl fill-current" />
              </div>
            </div>
            <h3 className="text-2xl font-serif text-[var(--w-primary)] mb-4">{closingTitle}</h3>
            <p className="text-gray-700 leading-relaxed">{closingBody}</p>
          </Card>
        </ScrollFade>
      </div>

      <Footer />
    </div>
  );
}

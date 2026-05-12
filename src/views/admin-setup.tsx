"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { weddingApi } from "@/services/wedding-api";
import { useAuth } from "@/context/auth-context";
import type { SiteRecord, UpdateSite } from "@shared/site-schema";
import {
  themeFromDressCodeColors,
  type DressCodeColor,
} from "@shared/wedding-palette";
import { DressCodeChips } from "@/components/dress-code-chips";
import { resolveColorName } from "@/lib/resolve-color-browser";
import { SitePhotoUploadBlock } from "@/components/site-photo-upload-block";

const STEPS = [
  "Couple & URL",
  "Date & hero",
  "Colors",
  "Photos",
  "Story & details",
  "Registry & payments",
  "Schedule & quick links",
  "Review & publish",
] as const;

const SETUP_FLOW_VERSION = 2;

function normalizeResumeStep(setupLastStep: unknown, setupFlowVersion: unknown): number {
  const max = STEPS.length - 1;
  const raw = typeof setupLastStep === "number" && setupLastStep >= 0 ? setupLastStep : 1;
  if (setupFlowVersion === SETUP_FLOW_VERSION) return Math.max(1, Math.min(raw || 1, max));
  if (raw <= 4) return Math.max(1, Math.min(raw, max));
  return max;
}

function parseUrlLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatForDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function hydrateCalendarField(raw: string | undefined, setter: (v: string) => void) {
  if (!raw?.trim()) {
    setter("");
    return;
  }
  const d = new Date(raw.trim());
  if (!Number.isNaN(d.getTime())) setter(formatForDatetimeLocal(d));
  else setter(raw.trim().slice(0, 16));
}

export default function AdminSetup() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [bootstrapped, setBootstrapped] = useState(false);
  const [hasExistingSite, setHasExistingSite] = useState(false);
  const [step, setStep] = useState(0);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [heroLine1, setHeroLine1] = useState("");
  const [heroLine2, setHeroLine2] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#800000");
  const [accentColor, setAccentColor] = useState("#f9a8d4");
  const [backgroundColor, setBackgroundColor] = useState("#fff1f2");
  /** Up to three “colours of the day” typed by the couple (we resolve to hex). */
  const [dressName1, setDressName1] = useState("");
  const [dressName2, setDressName2] = useState("");
  const [dressName3, setDressName3] = useState("");
  const [dressPreview, setDressPreview] = useState<DressCodeColor[] | null>(null);
  /** Gallery = home carousel + gallery page; hero = story / frames. */
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>([]);
  /** Full-bleed home hero; empty = auto (first hero, else first gallery). */
  const [homeHeroBackgroundImageUrl, setHomeHeroBackgroundImageUrl] = useState("");
  const [pasteUrlsText, setPasteUrlsText] = useState("");
  const [tagline, setTagline] = useState("");
  const [coupleDisplayName, setCoupleDisplayName] = useState("");
  const [storyHeading, setStoryHeading] = useState("");
  const [storyBody, setStoryBody] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");

  const [registryGiftTitle, setRegistryGiftTitle] = useState("");
  const [registryGiftBody, setRegistryGiftBody] = useState("");
  const [registryAccountHeading, setRegistryAccountHeading] = useState("");
  const [registryAccountName, setRegistryAccountName] = useState("");
  const [registryAccountNumber, setRegistryAccountNumber] = useState("");
  const [registryBankName, setRegistryBankName] = useState("");
  const [registryClosingTitle, setRegistryClosingTitle] = useState("");
  const [registryClosingBody, setRegistryClosingBody] = useState("");

  const [ceremonyTitle, setCeremonyTitle] = useState("");
  const [ceremonyDescription, setCeremonyDescription] = useState("");
  const [ceremonyDateDisplay, setCeremonyDateDisplay] = useState("");
  const [ceremonyTime, setCeremonyTime] = useState("");
  const [ceremonyRsvpPhone, setCeremonyRsvpPhone] = useState("");
  const [ceremonyLocation, setCeremonyLocation] = useState("");
  const [ceremonyDirectionsUrl, setCeremonyDirectionsUrl] = useState("");
  const [receptionTitle, setReceptionTitle] = useState("");
  const [receptionDescription, setReceptionDescription] = useState("");
  const [receptionDateDisplay, setReceptionDateDisplay] = useState("");
  const [receptionTime, setReceptionTime] = useState("");
  const [receptionRsvpPhone, setReceptionRsvpPhone] = useState("");
  const [receptionLocation, setReceptionLocation] = useState("");
  const [receptionDirectionsUrl, setReceptionDirectionsUrl] = useState("");
  const [schedulePageBackgroundImageUrl, setSchedulePageBackgroundImageUrl] = useState("");

  const [mapsDirectionsUrl, setMapsDirectionsUrl] = useState("");
  const [calendarEventTitle, setCalendarEventTitle] = useState("");
  const [calendarEventDescription, setCalendarEventDescription] = useState("");
  const [calendarEventLocation, setCalendarEventLocation] = useState("");
  const [calendarStartIso, setCalendarStartIso] = useState("");
  const [calendarEndIso, setCalendarEndIso] = useState("");
  const [calendarGoogleUrlOverride, setCalendarGoogleUrlOverride] = useState("");
  const [orderOfServiceUrl, setOrderOfServiceUrl] = useState("");
  const [actionBarProgrammeLabel, setActionBarProgrammeLabel] = useState("");
  const [actionBarCalendarLabel, setActionBarCalendarLabel] = useState("");
  const [actionBarDirectionsLabel, setActionBarDirectionsLabel] = useState("");
  const [footerMarqueeLead, setFooterMarqueeLead] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerCreditLine, setFooterCreditLine] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await weddingApi.listSites();
        if (cancelled || !res.success || !res.data?.length) {
          if (!cancelled) setBootstrapped(true);
          return;
        }
        const site = res.data[0]!;
        if (cancelled) return;
        setHasExistingSite(true);
        setSiteId(site._id);
        setSlug(site.slug);
        setPartnerOne(site.partnerOneName ?? "");
        setPartnerTwo(site.partnerTwoName ?? "");
        setTagline(site.tagline ?? "");
        if (site.weddingDate) {
          const d = new Date(site.weddingDate);
          if (!Number.isNaN(d.getTime())) setWeddingDate(d.toISOString().slice(0, 16));
        }
        const c = site.content;
        if (c) {
          setHeroLine1(c.heroHeadingLine1 ?? "");
          setHeroLine2(c.heroHeadingLine2 ?? "");
          setCoupleDisplayName(c.coupleDisplayName ?? "");
          setStoryHeading(c.storyHeading ?? "");
          setStoryBody(c.storyBody ?? "");
          setVenueName(c.venueName ?? "");
          setVenueAddress(c.venueAddress ?? "");
          setGalleryImageUrls(c.galleryImageUrls ?? []);
          setHeroImageUrls(c.heroImageUrls ?? []);
          setHomeHeroBackgroundImageUrl(c.homeHeroBackgroundImageUrl ?? "");
          setRegistryGiftTitle(c.registryGiftTitle ?? "");
          setRegistryGiftBody(c.registryGiftBody ?? "");
          setRegistryAccountHeading(c.registryAccountHeading ?? "");
          setRegistryAccountName(c.registryAccountName ?? "");
          setRegistryAccountNumber(c.registryAccountNumber ?? "");
          setRegistryBankName(c.registryBankName ?? "");
          setRegistryClosingTitle(c.registryClosingTitle ?? "");
          setRegistryClosingBody(c.registryClosingBody ?? "");
          setCeremonyTitle(c.ceremonyTitle ?? "");
          setCeremonyDescription(c.ceremonyDescription ?? "");
          setCeremonyDateDisplay(c.ceremonyDateDisplay ?? "");
          setCeremonyTime(c.ceremonyTime ?? "");
          setCeremonyRsvpPhone(c.ceremonyRsvpPhone ?? "");
          setCeremonyLocation(c.ceremonyLocation ?? "");
          setCeremonyDirectionsUrl(c.ceremonyDirectionsUrl ?? "");
          setReceptionTitle(c.receptionTitle ?? "");
          setReceptionDescription(c.receptionDescription ?? "");
          setReceptionDateDisplay(c.receptionDateDisplay ?? "");
          setReceptionTime(c.receptionTime ?? "");
          setReceptionRsvpPhone(c.receptionRsvpPhone ?? "");
          setReceptionLocation(c.receptionLocation ?? "");
          setReceptionDirectionsUrl(c.receptionDirectionsUrl ?? "");
          setSchedulePageBackgroundImageUrl(c.schedulePageBackgroundImageUrl ?? "");
          setMapsDirectionsUrl(c.mapsDirectionsUrl ?? "");
          setCalendarEventTitle(c.calendarEventTitle ?? "");
          setCalendarEventDescription(c.calendarEventDescription ?? "");
          setCalendarEventLocation(c.calendarEventLocation ?? "");
          hydrateCalendarField(c.calendarStartIso, setCalendarStartIso);
          hydrateCalendarField(c.calendarEndIso, setCalendarEndIso);
          setCalendarGoogleUrlOverride(c.calendarGoogleUrlOverride ?? "");
          setOrderOfServiceUrl(c.orderOfServiceUrl ?? "");
          setActionBarProgrammeLabel(c.actionBarProgrammeLabel ?? "");
          setActionBarCalendarLabel(c.actionBarCalendarLabel ?? "");
          setActionBarDirectionsLabel(c.actionBarDirectionsLabel ?? "");
          setFooterMarqueeLead(c.footerMarqueeLead ?? "");
          setFooterPhone(c.footerPhone ?? "");
          setFooterEmail(c.footerEmail ?? "");
          setFooterCreditLine(c.footerCreditLine ?? "");
        }
        const dress = site.theme?.dressCodeColors ?? [];
        if (dress[0]) setDressName1(dress[0].name);
        if (dress[1]) setDressName2(dress[1].name);
        if (dress[2]) setDressName3(dress[2].name);
        if (site.theme?.primaryColor) setPrimaryColor(site.theme.primaryColor);
        if (site.theme?.accentColor) setAccentColor(site.theme.accentColor);
        if (site.theme?.backgroundColor) setBackgroundColor(site.theme.backgroundColor);
        setStep(normalizeResumeStep(site.setupLastStep, site.setupFlowVersion));
      } catch {
        if (!cancelled) setError("Could not load your site");
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const allowed = new Set([...galleryImageUrls, ...heroImageUrls]);
    if (homeHeroBackgroundImageUrl && !allowed.has(homeHeroBackgroundImageUrl)) {
      setHomeHeroBackgroundImageUrl("");
    }
  }, [galleryImageUrls, heroImageUrls, homeHeroBackgroundImageUrl]);

  const refreshSlugSuggestion = async () => {
    setError("");
    if (!partnerOne.trim() || !partnerTwo.trim()) {
      setError("Enter both first names to suggest a URL slug.");
      return;
    }
    setBusy(true);
    try {
      const res = await weddingApi.suggestSlug(partnerOne.trim(), partnerTwo.trim());
      if (res.success && res.data?.suggested) {
        setSlug(res.data.suggested);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not suggest slug");
    } finally {
      setBusy(false);
    }
  };

  const putSite = async (body: UpdateSite, nextStep: number): Promise<boolean> => {
    if (!siteId) return false;
    setBusy(true);
    setError("");
    try {
      const res = await weddingApi.updateSite(siteId, {
        ...body,
        setupLastStep: nextStep,
        setupFlowVersion: SETUP_FLOW_VERSION,
      });
      if (res.success) {
        setStep(nextStep);
        return true;
      }
      setError(res.message || "Update failed");
      return false;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const step1Create = async () => {
    setError("");
    if (!slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      setError("Use a lowercase slug with letters, numbers, and hyphens only.");
      return;
    }
    setBusy(true);
    try {
      const res = await weddingApi.createSite({
        slug: slug.trim().toLowerCase(),
        status: "draft",
        partnerOneName: partnerOne.trim(),
        partnerTwoName: partnerTwo.trim(),
      });
      if (res.success && res.data?._id) {
        setSiteId(res.data._id);
        setHasExistingSite(true);
        setCoupleDisplayName(
          [partnerOne.trim(), partnerTwo.trim()].filter(Boolean).join(" & ")
        );
        setStep(1);
      } else {
        setError(res.message || "Could not create site");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create site");
    } finally {
      setBusy(false);
    }
  };

  const step2Save = async () => {
    await putSite(
      {
        ...(weddingDate.trim() ? { weddingDate: new Date(weddingDate) } : {}),
        content: {
          heroHeadingLine1: heroLine1.trim() || undefined,
          heroHeadingLine2: heroLine2.trim() || undefined,
        },
      },
      2
    );
  };

  function titleCaseColourName(raw: string): string {
    return raw
      .trim()
      .split(/\s+/)
      .map((w) => (w.length ? w[0]!.toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");
  }

  const lookupDressColours = () => {
    setError("");
    const slots = [dressName1, dressName2, dressName3].map((s) => s.trim()).filter(Boolean).slice(0, 3);
    if (slots.length === 0) {
      setError("Enter at least one colour name, or use Advanced hex fields below.");
      setDressPreview(null);
      return;
    }
    const out: DressCodeColor[] = [];
    for (const raw of slots) {
      const hex = resolveColorName(raw);
      if (!hex) {
        setError(
          `Could not find a colour for “${raw}”. Try common names (navy blue, gold, ash, burgundy) or a hex code like #1a2b3c.`,
        );
        setDressPreview(null);
        return;
      }
      out.push({ name: titleCaseColourName(raw), hex });
    }
    setDressPreview(out);
    const derived = themeFromDressCodeColors(out);
    setPrimaryColor(derived.primaryColor!);
    setAccentColor(derived.accentColor!);
    setBackgroundColor(derived.backgroundColor!);
  };

  const step3Save = async () => {
    const slots = [dressName1, dressName2, dressName3].map((s) => s.trim()).filter(Boolean).slice(0, 3);
    if (slots.length > 0) {
      const out: DressCodeColor[] = [];
      for (const raw of slots) {
        const hex = resolveColorName(raw);
        if (!hex) {
          setError(
            `Could not find a colour for “${raw}”. Tap “Look up colours” to check, or clear the names and use Advanced hex fields.`,
          );
          return;
        }
        out.push({ name: titleCaseColourName(raw), hex });
      }
      const theme = themeFromDressCodeColors(out);
      await putSite({ theme }, 3);
      return;
    }
    await putSite(
      {
        theme: {
          primaryColor,
          accentColor,
          backgroundColor,
          dressCodeColors: [],
        },
      },
      3
    );
  };

  const step4Save = async () => {
    if (galleryImageUrls.length === 0) {
      setError("Add at least one gallery image (upload files or paste URLs below).");
      return;
    }
    await putSite(
      {
        content: {
          galleryImageUrls,
          heroImageUrls,
          homeHeroBackgroundImageUrl: homeHeroBackgroundImageUrl.trim() || undefined,
        },
      },
      4
    );
  };

  const appendPastedToGallery = () => {
    const extra = parseUrlLines(pasteUrlsText);
    if (extra.length === 0) {
      setError("Paste one image URL per line, then tap “Add pasted to gallery”.");
      return;
    }
    setError("");
    setGalleryImageUrls((prev) => [...prev, ...extra]);
    setPasteUrlsText("");
  };

  const appendPastedToHero = () => {
    const extra = parseUrlLines(pasteUrlsText);
    if (extra.length === 0) {
      setError("Paste one image URL per line, then tap “Add pasted to hero”.");
      return;
    }
    setError("");
    setHeroImageUrls((prev) => [...prev, ...extra]);
    setPasteUrlsText("");
  };

  const saveStoryStep = async () => {
    await putSite(
      {
        tagline: tagline.trim() || undefined,
        content: {
          coupleDisplayName: coupleDisplayName.trim() || undefined,
          storyHeading: storyHeading.trim() || undefined,
          storyBody: storyBody.trim() || undefined,
          venueName: venueName.trim() || undefined,
          venueAddress: venueAddress.trim() || undefined,
        },
      },
      5
    );
  };

  const saveRegistryStep = async () => {
    await putSite(
      {
        content: {
          registryGiftTitle: registryGiftTitle.trim() || undefined,
          registryGiftBody: registryGiftBody.trim() || undefined,
          registryAccountHeading: registryAccountHeading.trim() || undefined,
          registryAccountName: registryAccountName.trim() || undefined,
          registryAccountNumber: registryAccountNumber.trim() || undefined,
          registryBankName: registryBankName.trim() || undefined,
          registryClosingTitle: registryClosingTitle.trim() || undefined,
          registryClosingBody: registryClosingBody.trim() || undefined,
        },
      },
      6
    );
  };

  const saveScheduleStep = async () => {
    await putSite(
      {
        content: {
          ceremonyTitle: ceremonyTitle.trim() || undefined,
          ceremonyDescription: ceremonyDescription.trim() || undefined,
          ceremonyDateDisplay: ceremonyDateDisplay.trim() || undefined,
          ceremonyTime: ceremonyTime.trim() || undefined,
          ceremonyRsvpPhone: ceremonyRsvpPhone.trim() || undefined,
          ceremonyLocation: ceremonyLocation.trim() || undefined,
          ceremonyDirectionsUrl: ceremonyDirectionsUrl.trim() || undefined,
          receptionTitle: receptionTitle.trim() || undefined,
          receptionDescription: receptionDescription.trim() || undefined,
          receptionDateDisplay: receptionDateDisplay.trim() || undefined,
          receptionTime: receptionTime.trim() || undefined,
          receptionRsvpPhone: receptionRsvpPhone.trim() || undefined,
          receptionLocation: receptionLocation.trim() || undefined,
          receptionDirectionsUrl: receptionDirectionsUrl.trim() || undefined,
          schedulePageBackgroundImageUrl: schedulePageBackgroundImageUrl.trim() || undefined,
          mapsDirectionsUrl: mapsDirectionsUrl.trim() || undefined,
          calendarEventTitle: calendarEventTitle.trim() || undefined,
          calendarEventDescription: calendarEventDescription.trim() || undefined,
          calendarEventLocation: calendarEventLocation.trim() || undefined,
          calendarStartIso: calendarStartIso.trim() || undefined,
          calendarEndIso: calendarEndIso.trim() || undefined,
          calendarGoogleUrlOverride: calendarGoogleUrlOverride.trim() || undefined,
          orderOfServiceUrl: orderOfServiceUrl.trim() || undefined,
          actionBarProgrammeLabel: actionBarProgrammeLabel.trim() || undefined,
          actionBarCalendarLabel: actionBarCalendarLabel.trim() || undefined,
          actionBarDirectionsLabel: actionBarDirectionsLabel.trim() || undefined,
          footerMarqueeLead: footerMarqueeLead.trim() || undefined,
          footerPhone: footerPhone.trim() || undefined,
          footerEmail: footerEmail.trim() || undefined,
          footerCreditLine: footerCreditLine.trim() || undefined,
        },
      },
      7
    );
  };

  const publishSite = async () => {
    if (!siteId) return;
    setBusy(true);
    setError("");
    try {
      const res = await weddingApi.updateSite(siteId, {
        status: "live",
        setupLastStep: STEPS.length - 1,
        setupFlowVersion: SETUP_FLOW_VERSION,
      });
      if (res.success && res.data) {
        router.replace(`/w/${res.data.slug}`);
      } else {
        setError(res.message || "Publish failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  };

  if (!bootstrapped) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 text-[#800000]">
        Loading your setup…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <h1 className="text-2xl font-serif text-[#800000]">Wedding setup</h1>
          <div className="flex items-center gap-2">
            {user ? (
              <span className="text-xs text-gray-500 max-w-[10rem] truncate hidden sm:inline" title={user.email}>
                {user.email}
              </span>
            ) : null}
            <Button asChild variant="ghost" size="sm" className="text-[#800000]">
              <Link href="/admin">Dashboard</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-gray-700"
              disabled={busy}
              onClick={() => void logout().then(() => router.replace("/"))}
            >
              Log out
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        {siteId && slug ? (
          <p className="text-xs text-gray-500 mb-4">
            <Link className="text-[#800000] underline underline-offset-2" href={`/w/${slug}`}>
              View wedding site
            </Link>{" "}
            — saves in setup apply immediately on your URL (draft or live).
          </p>
        ) : null}
        {error ? (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        ) : null}

        <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-6 space-y-4 shadow-sm border-rose-100">
            {step === 0 && !hasExistingSite && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="p1">Partner 1 first name</Label>
                  <Input id="p1" value={partnerOne} onChange={(e) => setPartnerOne(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2">Partner 2 first name</Label>
                  <Input id="p2" value={partnerTwo} onChange={(e) => setPartnerTwo(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => void refreshSlugSuggestion()} disabled={busy}>
                    Suggest URL slug
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Site URL slug (appears as /w/slug)</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="e.g. marble"
                  />
                </div>
                <Button className="w-full bg-[#800000]" disabled={busy} onClick={() => void step1Create()}>
                  Create site & continue
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Wedding date</Label>
                  <Input
                    type="datetime-local"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero line 1</Label>
                  <Input value={heroLine1} onChange={(e) => setHeroLine1(e.target.value)} placeholder="CELEBRATE LOVE," />
                </div>
                <div className="space-y-2">
                  <Label>Hero line 2</Label>
                  <Input
                    value={heroLine2}
                    onChange={(e) => setHeroLine2(e.target.value)}
                    placeholder="CELEBRATE LIFE WITH GRATITUDE"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => (hasExistingSite ? router.replace("/admin") : setStep(0))}
                    disabled={busy}
                  >
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void step2Save()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-gray-600">
                  Type up to three <strong>colours of the day</strong> (for example{" "}
                  <em>navy blue</em>, <em>gold</em>, <em>ash</em>). We match them to paint chips and use them across
                  your wedding site. Leave all three empty if you prefer to set hex colours only (advanced).
                </p>
                <div className="space-y-2">
                  <Label htmlFor="dc1">Colour 1</Label>
                  <Input
                    id="dc1"
                    value={dressName1}
                    onChange={(e) => setDressName1(e.target.value)}
                    placeholder="e.g. Navy blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dc2">Colour 2 (optional)</Label>
                  <Input id="dc2" value={dressName2} onChange={(e) => setDressName2(e.target.value)} placeholder="Gold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dc3">Colour 3 (optional)</Label>
                  <Input id="dc3" value={dressName3} onChange={(e) => setDressName3(e.target.value)} placeholder="Ash" />
                </div>
                <Button type="button" variant="secondary" className="w-full" disabled={busy} onClick={lookupDressColours}>
                  Look up colours
                </Button>
                {dressPreview && dressPreview.length > 0 ? (
                  <div className="rounded-lg border border-rose-200 bg-white p-4 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview</p>
                    <DressCodeChips colors={dressPreview} />
                  </div>
                ) : null}
                <details className="text-sm border border-dashed border-rose-200 rounded-md p-3 space-y-3">
                  <summary className="cursor-pointer font-medium text-gray-700">Advanced — hex colour pickers</summary>
                  <p className="text-gray-500 text-xs">
                    Use this only if you are not using named colours above. Saving with empty names uses these values
                    and clears saved “colours of the day” chips.
                  </p>
                  <div className="space-y-2">
                    <Label>Primary</Label>
                    <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Accent</Label>
                    <Input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Page background</Label>
                    <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                  </div>
                </details>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} disabled={busy}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void step3Save()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 3 && siteId && (
              <>
                <p className="text-sm text-gray-600">
                  Upload photos from your computer—they go to <strong>Cloudinary</strong> and we save the links on
                  your site. <strong>Gallery</strong> images power the filmstrip, glass gallery, and gallery page;{" "}
                  <strong>Hero</strong> images are optional (story polaroid and nav thumbnail). Pick which shot fills the
                  large <strong>home hero</strong> below—otherwise we use your first hero image, then your first gallery
                  image.
                </p>
                <SitePhotoUploadBlock
                  label="Gallery photos (required)"
                  description="At least one image. You can select multiple files at once."
                  urls={galleryImageUrls}
                  onUrlsChange={setGalleryImageUrls}
                  siteId={siteId}
                  kind="gallery"
                  disabled={busy}
                />
                <SitePhotoUploadBlock
                  label="Hero photos (optional)"
                  description="Couple shots for the story area and decorative frames on the home page."
                  urls={heroImageUrls}
                  onUrlsChange={setHeroImageUrls}
                  siteId={siteId}
                  kind="hero"
                  disabled={busy}
                />
                {galleryImageUrls.length + heroImageUrls.length > 0 ? (
                  <div className="space-y-3 rounded-xl border border-rose-200 bg-white/95 p-4 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Home hero background</p>
                      <p className="text-xs text-gray-500">
                        Full-bleed image behind your names and countdown. <strong>Auto</strong> uses the first hero
                        photo if you added any, otherwise the first gallery photo.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                      <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-gray-300 p-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 hover:border-rose-400 has-[:checked]:border-rose-600 has-[:checked]:bg-rose-50">
                        <input
                          type="radio"
                          name="homeHeroPick"
                          className="sr-only"
                          checked={!homeHeroBackgroundImageUrl}
                          onChange={() => setHomeHeroBackgroundImageUrl("")}
                        />
                        Auto
                      </label>
                      {Array.from(new Set([...galleryImageUrls, ...heroImageUrls])).map((url) => (
                        <label
                          key={url}
                          className={`cursor-pointer overflow-hidden rounded-lg border-2 transition hover:opacity-95 ${
                            homeHeroBackgroundImageUrl === url
                              ? "border-rose-600 ring-2 ring-rose-200"
                              : "border-transparent ring-1 ring-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="homeHeroPick"
                            className="sr-only"
                            checked={homeHeroBackgroundImageUrl === url}
                            onChange={() => setHomeHeroBackgroundImageUrl(url)}
                          />
                          <img src={url} alt="" className="h-16 w-14 object-cover sm:h-[4.5rem] sm:w-14" />
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                <details className="text-sm border border-dashed border-rose-200 rounded-md p-3 space-y-2">
                  <summary className="cursor-pointer font-medium text-gray-700">Or paste image URLs</summary>
                  <p className="text-xs text-gray-500">One HTTPS URL per line, then add to gallery or hero.</p>
                  <Textarea
                    rows={4}
                    value={pasteUrlsText}
                    onChange={(e) => setPasteUrlsText(e.target.value)}
                    placeholder={"https://...\nhttps://..."}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={appendPastedToGallery}>
                      Add pasted to gallery
                    </Button>
                    <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={appendPastedToHero}>
                      Add pasted to hero
                    </Button>
                  </div>
                </details>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={busy}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void step4Save()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Couple display name (shown on site)</Label>
                  <Input value={coupleDisplayName} onChange={(e) => setCoupleDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Story heading</Label>
                  <Input value={storyHeading} onChange={(e) => setStoryHeading(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Story body</Label>
                  <Textarea rows={5} value={storyBody} onChange={(e) => setStoryBody(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Venue name</Label>
                  <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Venue address</Label>
                  <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(3)} disabled={busy}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void saveStoryStep()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <p className="text-sm text-gray-600">
                  Optional cash-gift copy and bank details for your <strong>Registry</strong> page. Leave blank if you
                  prefer not to show account information.
                </p>
                <div className="space-y-2">
                  <Label>Gift section title</Label>
                  <Input value={registryGiftTitle} onChange={(e) => setRegistryGiftTitle(e.target.value)} placeholder="Would you like to gift us?" />
                </div>
                <div className="space-y-2">
                  <Label>Gift section message</Label>
                  <Textarea rows={4} value={registryGiftBody} onChange={(e) => setRegistryGiftBody(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Account block heading</Label>
                  <Input value={registryAccountHeading} onChange={(e) => setRegistryAccountHeading(e.target.value)} placeholder="e.g. Nigerian Account" />
                </div>
                <div className="space-y-2">
                  <Label>Account name</Label>
                  <Input value={registryAccountName} onChange={(e) => setRegistryAccountName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Account number</Label>
                  <Input value={registryAccountNumber} onChange={(e) => setRegistryAccountNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bank name</Label>
                  <Input value={registryBankName} onChange={(e) => setRegistryBankName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Closing card title</Label>
                  <Input value={registryClosingTitle} onChange={(e) => setRegistryClosingTitle(e.target.value)} placeholder="With Love & Gratitude" />
                </div>
                <div className="space-y-2">
                  <Label>Closing card message</Label>
                  <Textarea rows={3} value={registryClosingBody} onChange={(e) => setRegistryClosingBody(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(4)} disabled={busy}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void saveRegistryStep()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <p className="text-sm text-gray-600">
                  Ceremony and reception blocks power the <strong>Schedule</strong> page. Quick links power the home
                  floating bar (maps, calendar, order of service) and the footer marquee.
                </p>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Ceremony</p>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={ceremonyTitle} onChange={(e) => setCeremonyTitle(e.target.value)} placeholder="WEDDING CEREMONY" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={2} value={ceremonyDescription} onChange={(e) => setCeremonyDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Date (display)</Label>
                    <Input value={ceremonyDateDisplay} onChange={(e) => setCeremonyDateDisplay(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input value={ceremonyTime} onChange={(e) => setCeremonyTime(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>RSVP phone / WhatsApp</Label>
                  <Input value={ceremonyRsvpPhone} onChange={(e) => setCeremonyRsvpPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Textarea rows={2} value={ceremonyLocation} onChange={(e) => setCeremonyLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ceremony Google Maps link (optional)</Label>
                  <Input value={ceremonyDirectionsUrl} onChange={(e) => setCeremonyDirectionsUrl(e.target.value)} placeholder="https://maps.google.com/..." />
                </div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide pt-2">Reception</p>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={receptionTitle} onChange={(e) => setReceptionTitle(e.target.value)} placeholder="RECEPTION CELEBRATION" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={2} value={receptionDescription} onChange={(e) => setReceptionDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Date (display)</Label>
                    <Input value={receptionDateDisplay} onChange={(e) => setReceptionDateDisplay(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input value={receptionTime} onChange={(e) => setReceptionTime(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>RSVP phone</Label>
                  <Input value={receptionRsvpPhone} onChange={(e) => setReceptionRsvpPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Textarea rows={2} value={receptionLocation} onChange={(e) => setReceptionLocation(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Reception Google Maps link (optional)</Label>
                  <Input value={receptionDirectionsUrl} onChange={(e) => setReceptionDirectionsUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Schedule page background image URL</Label>
                  <Input value={schedulePageBackgroundImageUrl} onChange={(e) => setSchedulePageBackgroundImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide pt-2">Home quick actions</p>
                <div className="space-y-2">
                  <Label>Get directions (Maps URL)</Label>
                  <Input value={mapsDirectionsUrl} onChange={(e) => setMapsDirectionsUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Calendar event title</Label>
                  <Input value={calendarEventTitle} onChange={(e) => setCalendarEventTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Calendar event description</Label>
                  <Textarea rows={2} value={calendarEventDescription} onChange={(e) => setCalendarEventDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Calendar event location</Label>
                  <Input value={calendarEventLocation} onChange={(e) => setCalendarEventLocation(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Event start (local)</Label>
                    <Input type="datetime-local" value={calendarStartIso} onChange={(e) => setCalendarStartIso(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Event end (local)</Label>
                    <Input type="datetime-local" value={calendarEndIso} onChange={(e) => setCalendarEndIso(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Or full Google Calendar URL (overrides builder)</Label>
                  <Input value={calendarGoogleUrlOverride} onChange={(e) => setCalendarGoogleUrlOverride(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Order of service / PDF URL</Label>
                  <Input value={orderOfServiceUrl} onChange={(e) => setOrderOfServiceUrl(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label>Bar: Programme label</Label>
                    <Input value={actionBarProgrammeLabel} onChange={(e) => setActionBarProgrammeLabel(e.target.value)} placeholder="Programme" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bar: Calendar label</Label>
                    <Input value={actionBarCalendarLabel} onChange={(e) => setActionBarCalendarLabel(e.target.value)} placeholder="Calendar" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bar: Directions label</Label>
                    <Input value={actionBarDirectionsLabel} onChange={(e) => setActionBarDirectionsLabel(e.target.value)} placeholder="Get Direction" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide pt-2">Footer marquee</p>
                <div className="space-y-2">
                  <Label>Lead phrase</Label>
                  <Input value={footerMarqueeLead} onChange={(e) => setFooterMarqueeLead(e.target.value)} placeholder="LOVE LIKE THIS" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={footerPhone} onChange={(e) => setFooterPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Credit / org line</Label>
                  <Input value={footerCreditLine} onChange={(e) => setFooterCreditLine(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(5)} disabled={busy}>
                    Back
                  </Button>
                  <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={() => void saveScheduleStep()}>
                    Save & continue
                  </Button>
                </div>
              </>
            )}

            {step === 7 && siteId ? (
              <ReviewStep
                siteId={siteId}
                slug={slug}
                busy={busy}
                onBack={() => setStep(6)}
                onPublish={() => void publishSite()}
              />
            ) : null}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ReviewStep({
  siteId,
  slug,
  busy,
  onBack,
  onPublish,
}: {
  siteId: string;
  slug: string;
  busy: boolean;
  onBack: () => void;
  onPublish: () => void;
}) {
  const [preview, setPreview] = useState<SiteRecord | null>(null);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await weddingApi.getSite(siteId);
        if (!cancelled && res.success && res.data) {
          setPreview(res.data);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadErr(e instanceof Error ? e.message : "Could not load site");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const displaySlug = preview?.slug ?? slug;

  return (
    <>
      {loadErr ? <p className="text-sm text-red-600 mb-2">{loadErr}</p> : null}
      {preview ? (
        <ul className="text-sm text-gray-700 space-y-1 mb-4">
          <li>
            <strong>Slug:</strong> {preview.slug}
          </li>
          <li>
            <strong>Status:</strong> {preview.status}
          </li>
          <li>
            <strong>Gallery images:</strong> {preview.content?.galleryImageUrls?.length ?? 0}
          </li>
          <li>
            <strong>Wedding date:</strong>{" "}
            {preview.weddingDate ? new Date(preview.weddingDate).toLocaleString() : "—"}
          </li>
          <li>
            <strong>Colours of the day:</strong>{" "}
            {preview.theme?.dressCodeColors?.length
              ? preview.theme.dressCodeColors.map((c) => `${c.name} (${c.hex})`).join(" · ")
              : "—"}
          </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-4">Loading summary…</p>
      )}
      <p className="text-sm text-gray-600 mb-4">
        Your wedding URL <code className="bg-rose-100 px-1 rounded">/w/{displaySlug}</code> already shows the latest
        saved content (even while status is <strong>draft</strong>). Use <strong>Publish</strong> when you are ready
        to mark the site as live.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={onBack} disabled={busy}>
          Back
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/w/${displaySlug}`}>View site (saved content)</Link>
        </Button>
        <Button className="flex-1 bg-[#800000]" disabled={busy} onClick={onPublish}>
          Publish & view site
        </Button>
      </div>
    </>
  );
}

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { weddingApi } from "@/services/wedding-api";
import { X } from "lucide-react";

type Props = {
  label: string;
  description: string;
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  siteId: string;
  kind: "gallery" | "hero";
  disabled?: boolean;
};

export function SitePhotoUploadBlock({
  label,
  description,
  urls,
  onUrlsChange,
  siteId,
  kind,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localErr, setLocalErr] = useState("");

  const onFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setLocalErr("");
    setUploading(true);
    try {
      const newUrls = await weddingApi.uploadSiteImages(siteId, Array.from(list), kind);
      onUrlsChange([...urls, ...newUrls]);
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base">{label}</Label>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="cursor-pointer max-w-full sm:max-w-md"
          disabled={disabled || uploading}
          onChange={(e) => void onFiles(e.target.files)}
        />
        {uploading ? <span className="text-sm text-gray-600">Uploading…</span> : null}
      </div>
      {localErr ? <p className="text-sm text-red-600">{localErr}</p> : null}
      {urls.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <div
              key={`${u}-${i}`}
              className="relative h-24 w-24 overflow-hidden rounded-md border border-rose-200 bg-muted"
            >
              <img src={u} alt="" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-0.5 top-0.5 h-7 w-7 rounded-full bg-black/70 text-white hover:bg-black/90"
                disabled={disabled || uploading}
                onClick={() => onUrlsChange(urls.filter((_, j) => j !== i))}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

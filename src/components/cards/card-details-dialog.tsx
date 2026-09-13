"use client";

import {
  useState,
} from "react";

import {
  Check,
  Copy,
  Download,
  Loader2,
  QrCode,
  Radio,
} from "lucide-react";

import {
  QRCodeSVG,
} from "qrcode.react";

import {
  toast,
} from "sonner";

import type {
  ReviewCard,
} from "@/types/card";

import {
  cardsService,
} from "@/services/cards.service";

import {
  getApiErrorMessage,
} from "@/lib/api-error";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  card:
    | ReviewCard
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
};

export function CardDetailsDialog({
  card,
  open,
  onOpenChange,
}: Props) {
  const [
    copied,
    setCopied,
  ] =
    useState<
      "qr" | "nfc" | null
    >(null);

  const [
    downloading,
    setDownloading,
  ] =
    useState(false);

  if (!card) {
    return null;
  }

  const copy = async (
    type:
      | "qr"
      | "nfc",
    value: string
  ) => {
    await navigator.clipboard
      .writeText(value);

    setCopied(type);

    setTimeout(
      () =>
        setCopied(null),
      1500
    );

    toast.success(
      "Link copied"
    );
  };

  const downloadQr =
    async () => {
      try {
        setDownloading(
          true
        );

        const blob =
          await cardsService
            .getQrSvg(
              card.id
            );

        const url =
          URL.createObjectURL(
            blob
          );

        const anchor =
          document.createElement(
            "a"
          );

        anchor.href = url;

        anchor.download =
          `valyou-${card.code}.svg`;

        document.body.appendChild(
          anchor
        );

        anchor.click();

        anchor.remove();

        URL.revokeObjectURL(
          url
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to download QR"
          )
        );
      } finally {
        setDownloading(
          false
        );
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {card.label ??
              "Review Card"}
          </DialogTitle>

          <DialogDescription>
            QR and NFC destinations
            for this physical card.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2 sm:grid-cols-[300px_1fr] overflow-scroll">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
            <QRCodeSVG
              value={
                card.urls
                  .qrUrl
              }
              size={190}
              level="M"
              marginSize={
                4
              }
              bgColor="#ffffff"
              fgColor="#000000"
              title={`QR code for ${card.label ?? card.code}`}
            />

            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              {card.code}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Location
              </p>

              <p className="mt-1 font-medium">
                {card.store
                  ?.name ??
                  "Not assigned"}
              </p>

              {card.store
                ?.business && (
                <p className="text-sm text-muted-foreground">
                  {
                    card.store
                      .business
                      .name
                  }
                </p>
              )}
            </div>

            <LinkRow
              icon={Radio}
              title="NFC link"
              value={
                card.urls
                  .nfcUrl
              }
              copied={
                copied ===
                "nfc"
              }
              onCopy={() =>
                copy(
                  "nfc",
                  card.urls
                    .nfcUrl
                )
              }
            />

            <LinkRow
              icon={QrCode}
              title="QR link"
              value={
                card.urls
                  .qrUrl
              }
              copied={
                copied ===
                "qr"
              }
              onCopy={() =>
                copy(
                  "qr",
                  card.urls
                    .qrUrl
                )
              }
            />

            <Button
              variant="outline"
              className="w-full"
              disabled={
                downloading
              }
              onClick={
                downloadQr
              }
            >
              {downloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}

              Download QR SVG
            </Button>

            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
              The QR and NFC URLs
              stay permanent. The
              destination can change
              later without reprinting
              the physical card.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LinkRow({
  icon: Icon,
  title,
  value,
  copied,
  onCopy,
}: {
  icon: React.ElementType;

  title: string;

  value: string;

  copied: boolean;

  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-emerald-500" />

        <span className="text-sm font-medium">
          {title}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-2.5 py-2 text-xs text-muted-foreground">
          {value}
        </code>

        <Button
          size="icon"
          variant="ghost"
          onClick={
            onCopy
          }
        >
          {copied ? (
            <Check className="size-4 text-emerald-500" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
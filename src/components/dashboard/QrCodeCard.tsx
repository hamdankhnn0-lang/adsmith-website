"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { Copy, Download, Printer, Check } from "lucide-react";

export function QrCodeCard({ branchName, url }: { branchName: string; url: string }) {
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: "#1a1a1a", light: "#ffffff" } }).then(setPngDataUrl);
    QRCode.toString(url, { type: "svg", margin: 2, color: { dark: "#1a1a1a", light: "#ffffff" } }).then(setSvgString);
  }, [url]);

  function downloadPng() {
    if (!pngDataUrl) return;
    const a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = `pizzabox-qr-${branchName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  }

  function downloadSvg() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url2;
    a.download = `pizzabox-qr-${branchName.toLowerCase().replace(/\s+/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(url2);
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function printCard() {
    const win = window.open("", "_blank");
    if (!win || !pngDataUrl) return;
    win.document.write(`
      <html><head><title>Pizza Box QR - ${branchName}</title></head>
      <body style="font-family: sans-serif; text-align:center; padding:40px;">
        <div style="max-width:320px;margin:0 auto;border:2px solid #d32f2f;border-radius:16px;padding:24px;">
          <div style="width:56px;height:56px;background:#d32f2f;color:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:18px;margin:0 auto 12px;">PB</div>
          <h2 style="margin:0;">Pizza Box Peshawar</h2>
          <p style="color:#666;margin:4px 0 16px;">Share Your Experience</p>
          <img src="${pngDataUrl}" style="width:220px;height:220px;" />
          <h3 style="margin:16px 0 4px;">${branchName} Branch</h3>
          <p style="color:#666;font-size:13px;">Scan to tell us about your visit</p>
        </div>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red text-xs font-bold text-white">PB</div>
        <div>
          <p className="text-sm font-semibold leading-tight">Pizza Box Peshawar</p>
          <p className="text-xs text-text-muted leading-tight">Share Your Experience</p>
        </div>
      </div>

      <div className="flex justify-center rounded-lg bg-surface-muted p-4">
        {pngDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pngDataUrl} alt={`QR code for ${branchName}`} className="h-40 w-40" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center text-xs text-text-muted">Generating...</div>
        )}
      </div>

      <h3 className="mt-3 text-center text-sm font-semibold">{branchName} Branch</h3>
      <p className="text-center text-xs text-text-muted">Scan to tell us about your visit</p>
      <p className="mt-1 truncate text-center text-[11px] text-text-muted">{url}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" variant="secondary" onClick={downloadPng}><Download size={13} /> PNG</Button>
        <Button size="sm" variant="secondary" onClick={downloadSvg}><Download size={13} /> SVG</Button>
        <Button size="sm" variant="outline" onClick={printCard}><Printer size={13} /> Print</Button>
        <Button size="sm" variant="outline" onClick={copyUrl}>
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy URL"}
        </Button>
      </div>
    </div>
  );
}

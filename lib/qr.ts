import QRCode from "qrcode";

export async function generarQR(localSlug: string): Promise<string> {
  const url = `https://alebrijes.rest/local/${localSlug}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  return qrDataUrl;
}

export async function generarQRSVG(localSlug: string): Promise<string> {
  const url = `https://alebrijes.rest/local/${localSlug}`;
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
  return svg;
}

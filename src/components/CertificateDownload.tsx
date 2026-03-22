import { useCallback } from 'react';

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  credentialId: string;
}

/** Draws an official-looking certificate on a canvas and triggers a PNG download. */
export function downloadCertificate(props: CertificateProps) {
  const canvas = renderCertificateCanvas(props);
  const link = document.createElement('a');
  link.download = `WTF-Certificate-${props.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/** Renders the certificate to a canvas and returns it. */
function renderCertificateCanvas({ studentName, courseTitle, issuedAt, credentialId }: CertificateProps): HTMLCanvasElement {
  const W = 1600;
  const H = 1130;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ──
  ctx.fillStyle = '#0f0f14';
  ctx.fillRect(0, 0, W, H);

  // Inner parchment area
  const m = 40;
  const r = 16;
  roundRect(ctx, m, m, W - m * 2, H - m * 2, r);
  const grad = ctx.createLinearGradient(m, m, m, H - m);
  grad.addColorStop(0, '#17171f');
  grad.addColorStop(1, '#111118');
  ctx.fillStyle = grad;
  ctx.fill();

  // ── Gold double border ──
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 3;
  roundRect(ctx, m, m, W - m * 2, H - m * 2, r);
  ctx.stroke();

  ctx.strokeStyle = '#c9a22740';
  ctx.lineWidth = 1.5;
  roundRect(ctx, m + 12, m + 12, W - (m + 12) * 2, H - (m + 12) * 2, r - 4);
  ctx.stroke();

  // ── Corner ornaments ──
  drawCornerOrnament(ctx, m + 24, m + 24, 1, 1);
  drawCornerOrnament(ctx, W - m - 24, m + 24, -1, 1);
  drawCornerOrnament(ctx, m + 24, H - m - 24, 1, -1);
  drawCornerOrnament(ctx, W - m - 24, H - m - 24, -1, -1);

  // ── Top decorative line ──
  const lineY = 190;
  ctx.strokeStyle = '#c9a22750';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, lineY);
  ctx.lineTo(W / 2 - 120, lineY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 + 120, lineY);
  ctx.lineTo(W - 200, lineY);
  ctx.stroke();

  // Diamond center ornament
  ctx.fillStyle = '#c9a227';
  ctx.beginPath();
  ctx.moveTo(W / 2, lineY - 6);
  ctx.lineTo(W / 2 + 6, lineY);
  ctx.lineTo(W / 2, lineY + 6);
  ctx.lineTo(W / 2 - 6, lineY);
  ctx.closePath();
  ctx.fill();

  // ── WTF Logo area ──
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 28px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('WORLD TEACHING FOUNDATION', W / 2, 120);

  ctx.fillStyle = '#c9a22780';
  ctx.font = '13px Georgia, "Times New Roman", serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('E S T .   2 0 2 5', W / 2, 150);
  ctx.letterSpacing = '0px';

  // ── Certificate of Completion ──
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '300 42px Georgia, "Times New Roman", serif';
  ctx.fillText('Certificate of Completion', W / 2, 260);

  // ── Subtext ──
  ctx.fillStyle = '#888';
  ctx.font = '15px Georgia, "Times New Roman", serif';
  ctx.fillText('This certificate is proudly presented to', W / 2, 320);

  // ── Student name ──
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Georgia, "Times New Roman", serif';
  ctx.fillText(studentName, W / 2, 400);

  // Underline under name
  const nameWidth = ctx.measureText(studentName).width;
  ctx.strokeStyle = '#c9a22760';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameWidth / 2 - 20, 418);
  ctx.lineTo(W / 2 + nameWidth / 2 + 20, 418);
  ctx.stroke();

  // ── Description ──
  ctx.fillStyle = '#999';
  ctx.font = '16px Georgia, "Times New Roman", serif';
  ctx.fillText('has successfully completed the course', W / 2, 475);

  // ── Course title ──
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 38px Georgia, "Times New Roman", serif';
  ctx.fillText(courseTitle, W / 2, 540);

  // ── Bottom decorative line ──
  const bLineY = 590;
  ctx.strokeStyle = '#c9a22750';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(300, bLineY);
  ctx.lineTo(W - 300, bLineY);
  ctx.stroke();

  // ── Details text ──
  ctx.fillStyle = '#777';
  ctx.font = '14px Georgia, "Times New Roman", serif';
  ctx.fillText(
    'through the World Teaching Foundation learning platform',
    W / 2,
    640
  );

  // ── Bottom section: Signature, Date, Credential ──
  const bottomY = 780;

  // Left — Signature
  ctx.fillStyle = '#c9a227';
  ctx.font = 'italic 28px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('WTF', W * 0.25, bottomY);
  ctx.strokeStyle = '#c9a22750';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.25 - 80, bottomY + 15);
  ctx.lineTo(W * 0.25 + 80, bottomY + 15);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '12px Georgia, "Times New Roman", serif';
  ctx.fillText('Authorized Signature', W * 0.25, bottomY + 38);

  // Center — Date
  const date = new Date(issuedAt);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '18px Georgia, "Times New Roman", serif';
  ctx.fillText(dateStr, W * 0.5, bottomY);
  ctx.strokeStyle = '#c9a22750';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.5 - 100, bottomY + 15);
  ctx.lineTo(W * 0.5 + 100, bottomY + 15);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '12px Georgia, "Times New Roman", serif';
  ctx.fillText('Date of Completion', W * 0.5, bottomY + 38);

  // Right — Credential ID
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText(credentialId, W * 0.75, bottomY);
  ctx.strokeStyle = '#c9a22750';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.75 - 100, bottomY + 15);
  ctx.lineTo(W * 0.75 + 100, bottomY + 15);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '12px Georgia, "Times New Roman", serif';
  ctx.fillText('Credential ID', W * 0.75, bottomY + 38);

  // ── Seal / Stamp ──
  drawSeal(ctx, W / 2, 920, 55);

  // ── Bottom text ──
  ctx.fillStyle = '#555';
  ctx.font = '11px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Verify at worldteachingfoundation.org/verify • This certificate was issued electronically and is valid without a physical signature.',
    W / 2,
    1010
  );

  // ── Footer bar ──
  ctx.fillStyle = '#c9a22715';
  ctx.fillRect(m + 1, H - m - 50, W - (m + 1) * 2, 49);
  ctx.fillStyle = '#c9a22760';
  ctx.font = 'bold 11px Georgia, "Times New Roman", serif';
  ctx.fillText('WTF — WORLD TEACHING FOUNDATION', W / 2, H - m - 20);

  return canvas;
}

/** Opens the certificate in a new browser tab for viewing / printing. */
export function viewCertificate(props: CertificateProps) {
  // Re-use the same renderer by calling downloadCertificate's internal canvas builder
  const canvas = renderCertificateCanvas(props);
  const dataUrl = canvas.toDataURL('image/png');
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(`<!DOCTYPE html><html><head><title>WTF Certificate — ${props.courseTitle}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0f0f14;display:flex;justify-content:center;align-items:center;min-height:100vh}img{max-width:100%;height:auto}</style></head><body><img src="${dataUrl}" alt="Certificate" /></body></html>`);
    win.document.close();
  }
}

// ── Helpers ──

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCornerOrnament(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) {
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  const s = 30;
  ctx.beginPath();
  ctx.moveTo(x, y + dy * s);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dx * s, y);
  ctx.stroke();
  // inner
  ctx.strokeStyle = '#c9a22760';
  ctx.lineWidth = 1;
  const s2 = 18;
  ctx.beginPath();
  ctx.moveTo(x, y + dy * s2);
  ctx.lineTo(x, y);
  ctx.lineTo(x + dx * s2, y);
  ctx.stroke();
}

function drawSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // Outer gear / seal
  ctx.save();
  ctx.translate(cx, cy);

  // Spikes
  const spikes = 24;
  ctx.fillStyle = '#c9a22730';
  ctx.beginPath();
  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const outerR = r + 8;
    const innerR = r - 2;
    const rad = i % 2 === 0 ? outerR : innerR;
    const x = Math.cos(angle) * rad;
    const y = Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Inner circle
  ctx.beginPath();
  ctx.arc(0, 0, r - 10, 0, Math.PI * 2);
  ctx.fillStyle = '#c9a22720';
  ctx.fill();
  ctx.strokeStyle = '#c9a22760';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // WTF text in seal
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 22px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WTF', 0, -2);

  // Small star below
  ctx.font = '10px Georgia, "Times New Roman", serif';
  ctx.fillText('★ ★ ★', 0, 18);

  ctx.restore();
}

/** React hook that returns download and view handlers */
export function useCertificateDownload() {
  const download = useCallback(
    (props: CertificateProps) => downloadCertificate(props),
    [],
  );
  const view = useCallback(
    (props: CertificateProps) => viewCertificate(props),
    [],
  );
  return { download, view };
}

import { useState, useCallback, useRef, useEffect } from 'react';
import { renderCertificateCanvas, type CertificateProps } from './CertificateDownload';
import Modal from './Modal';

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  props: CertificateProps | null;
}

export default function CertificateModal({ open, onClose, props }: CertificateModalProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const prevProps = useRef<CertificateProps | null>(null);

  useEffect(() => {
    if (!open || !props) { setImgSrc(null); return; }
    // Only re-render if props changed
    if (prevProps.current !== props) {
      const canvas = renderCertificateCanvas(props);
      setImgSrc(canvas.toDataURL('image/png'));
      prevProps.current = props;
    }
  }, [open, props]);

  const handleDownload = useCallback(() => {
    if (!imgSrc || !props) return;
    const link = document.createElement('a');
    link.download = `WTF-Certificate-${props.courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    link.href = imgSrc;
    link.click();
  }, [imgSrc, props]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-4">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="WTF Certificate"
            className="w-full max-w-[800px] rounded-lg"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-muted">Loading certificate...</div>
        )}
        <div className="flex items-center justify-center gap-3 pb-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/20 hover:border-accent/50 active:scale-95"
          >
            ⬇ Download PNG
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-hover px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-surface hover:border-accent/30 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

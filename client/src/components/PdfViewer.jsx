import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Cấu hình worker cho PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ url }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load PDF document
  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError('');

    const loadPdf = async () => {
      try {
        const doc = await pdfjsLib.getDocument({ url }).promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Lỗi load PDF:', err);
        setError(`Không thể mở tài liệu PDF này. Chi tiết lỗi: ${err.message || 'File hỏng hoặc lỗi mạng'}`);
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [url]);

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    };
    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <span>Đang tải tài liệu PDF...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#f87171', fontSize: '16px' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1e293b' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
        padding: '10px 16px', backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexShrink: 0
      }}>
        <button onClick={goToPrevPage} disabled={currentPage <= 1}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: currentPage <= 1 ? '#475569' : 'white', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
          <ChevronLeft size={18} />
        </button>

        <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600', minWidth: '100px', textAlign: 'center' }}>
          Trang {currentPage} / {totalPages}
        </span>

        <button onClick={goToNextPage} disabled={currentPage >= totalPages}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: currentPage >= totalPages ? '#475569' : 'white', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
          <ChevronRight size={18} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>

        <button onClick={zoomOut} disabled={scale <= 0.5}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: scale <= 0.5 ? '#475569' : 'white', cursor: scale <= 0.5 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
          <ZoomOut size={18} />
        </button>

        <span style={{ color: '#94a3b8', fontSize: '13px', minWidth: '50px', textAlign: 'center' }}>
          {Math.round(scale * 100)}%
        </span>

        <button onClick={zoomIn} disabled={scale >= 3}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '6px 10px', color: scale >= 3 ? '#475569' : 'white', cursor: scale >= 3 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
          <ZoomIn size={18} />
        </button>
      </div>

      {/* PDF Canvas */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '20px', backgroundColor: '#334155' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <canvas ref={canvasRef} style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.3)', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

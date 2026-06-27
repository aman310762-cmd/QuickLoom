'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, Category } from '@/lib/types';
import Link from 'next/link';

interface GeneratedImage {
  url: string;
  approved: boolean;
  isRegenerating: boolean;
}

export default function AIPhotoStudioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [category, setCategory] = useState<Category>('bedsheets');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [cutoutUrl, setCutoutUrl] = useState<string>('');
  const [variations, setVariations] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string>('');
  const [isAddingToCatalog, setIsAddingToCatalog] = useState(false);
  const [numVariations, setNumVariations] = useState<number>(3);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      // Reset generated output when uploading a new file
      setVariations([]);
      setCutoutUrl('');
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please drop a valid image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setVariations([]);
      setCutoutUrl('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setVariations([]);
    setCutoutUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setError('');
    setGenerationStep('Removing messy background while preserving the product...');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('category', category);
    formData.append('numVariations', String(numVariations));

    try {
      const res = await fetch('/api/admin/photo-studio/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to clean product image');
      }

      setCutoutUrl(data.cutoutUrl);
      setVariations(
        data.urls.map((url: string) => ({
          url,
          approved: true, // Default to approved so it is convenient
          isRegenerating: false,
        }))
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    if (!cutoutUrl) return;

    // Set loading state for this index
    setVariations(prev =>
      prev.map((v, i) => (i === index ? { ...v, isRegenerating: true } : v))
    );

    try {
      const res = await fetch('/api/admin/photo-studio/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cutoutUrl, index }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to rebuild catalog output');
      }

      setVariations(prev =>
        prev.map((v, i) =>
          i === index
            ? { url: data.url, approved: true, isRegenerating: false }
            : v
        )
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(`Rebuild failed: ${errMsg}`);
      setVariations(prev =>
        prev.map((v, i) => (i === index ? { ...v, isRegenerating: false } : v))
      );
    }
  };

  const handleRegenerateAll = async () => {
    if (!selectedFile) return;
    await handleGenerate();
  };

  const handleToggleApprove = (index: number) => {
    setVariations(prev =>
      prev.map((v, i) => (i === index ? { ...v, approved: !v.approved } : v))
    );
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `quickloom-clean-${category}-${index + 1}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download image natively, opening in new tab instead:', err);
      window.open(url, '_blank');
    }
  };

  const handleAddToCatalog = async () => {
    const approvedUrls = variations.filter(v => v.approved).map(v => v.url);
    if (approvedUrls.length === 0) {
      alert('Please approve at least one clean catalog image to add to the website.');
      return;
    }

    setIsAddingToCatalog(true);

    try {
      const res = await fetch('/api/admin/photo-studio/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, approvedUrls }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product draft');
      }

      // Redirect directly to catalog page with edit parameter set to open the modal
      router.push(`/admin/products?edit=${data.productId}`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(`Failed to add product to website: ${errMsg}`);
    } finally {
      setIsAddingToCatalog(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      paddingBottom: '40px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '16px',
    },
    titleSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    title: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '28px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      color: 'var(--text-muted)',
      fontSize: '14px',
    },
    editorLayout: {
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: '32px',
      alignItems: 'start',
    },
    sidebarCard: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    uploadZone: {
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '32px 16px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      background: 'var(--bg-alt)',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '12px',
    },
    previewContainer: {
      position: 'relative' as const,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      width: '100%',
      aspectRatio: '1/1',
      background: 'var(--bg-alt)',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    clearBtn: {
      position: 'absolute' as const,
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      fontWeight: 600,
      fontSize: '14px',
      color: 'var(--text)',
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      fontSize: '14px',
      background: 'var(--card)',
      color: 'var(--text)',
      fontFamily: 'inherit',
    },
    generateBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      fontWeight: 700,
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    },
    resultsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    resultsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    resultsTitle: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '20px',
    },
    actionsRow: {
      display: 'flex',
      gap: '12px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    },
    card: {
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'all 0.25s ease',
    },
    cardHeader: {
      position: 'absolute' as const,
      top: '12px',
      left: '12px',
      right: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 2,
    },
    badge: {
      fontSize: '11px',
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      backdropFilter: 'blur(4px)',
    },
    approveCheckbox: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.2s',
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%',
      aspectRatio: '1/1',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    },
    generatedImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    cardBody: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
      marginTop: 'auto',
    },
    cardStyleName: {
      fontWeight: 700,
      fontSize: '15px',
      color: 'var(--text)',
    },
    cardActions: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '8px',
    },
    cardBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '10px 14px',
      borderRadius: 'var(--radius-md)',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      border: '1px solid var(--border)',
      background: 'var(--card)',
      color: 'var(--text)',
      transition: 'all 0.2s',
    },
    regenerateBtn: {
      border: 'none',
      background: 'var(--accent-light)',
      color: 'var(--accent-text)',
    },
    skeletonCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      aspectRatio: '1/1',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      animation: 'pulse 1.8s infinite ease-in-out',
    },
  };

  const styleNames = ['Clean White', 'Warm Neutral', 'Soft Home'];

  return (
    <div style={styles.container}>
      {/* CSS keyframe animations injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        .spinner-icon {
          animation: rotate 1s linear infinite;
        }
        @media (max-width: 900px) {
          .photo-studio-layout {
            grid-template-columns: 1fr !important;
          }
          .variations-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--accent)' }}>auto_awesome</span>
            AI Photo Cleanup
          </h1>
          <p style={styles.subtitle}>Remove messy backgrounds while keeping the real product color, pattern, and weave intact</p>
        </div>
        <Link href="/admin" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Dashboard
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="photo-studio-layout" style={styles.editorLayout}>
        {/* Sidebar Controls */}
        <div style={styles.sidebarCard}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Image</label>

            {previewUrl ? (
              <div style={styles.previewContainer}>
                <img src={previewUrl} alt="Product Preview" style={styles.previewImage} />
                <button style={styles.clearBtn} onClick={clearFile} disabled={isGenerating || isAddingToCatalog} title="Clear Image">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                </button>
              </div>
            ) : (
              <div
                style={styles.uploadZone}
                onClick={triggerSelectFile}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-faint)' }}>photo_camera</span>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Upload casual photo</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drag & drop or tap to capture</div>
              </div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="studio-category" style={styles.label}>Product Category</label>
            <select
              id="studio-category"
              style={styles.select}
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              disabled={isGenerating || isAddingToCatalog}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="studio-variations" style={styles.label}>Catalog Outputs</label>
            <select
              id="studio-variations"
              style={styles.select}
              value={numVariations}
              onChange={e => setNumVariations(Number(e.target.value))}
              disabled={isGenerating || isAddingToCatalog}
            >
              <option value={1}>1 output (1 paid cleanup)</option>
              <option value={2}>2 outputs (same paid cleanup)</option>
              <option value={3}>3 outputs (same paid cleanup)</option>
            </select>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(186, 26, 26, 0.1)',
              color: '#BA1A1A',
              fontSize: '13px',
              lineHeight: 1.4,
            }}>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>Error</div>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating || isAddingToCatalog}
            className={`btn ${selectedFile && !isGenerating && !isAddingToCatalog ? 'btn-primary' : 'btn-neutral'}`}
            style={{
              ...styles.generateBtn,
              cursor: selectedFile && !isGenerating && !isAddingToCatalog ? 'pointer' : 'not-allowed',
              opacity: selectedFile && !isGenerating && !isAddingToCatalog ? 1 : 0.6,
            }}
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined spinner-icon" style={{ fontSize: '20px' }}>sync</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
                Clean & Create {numVariations} Output{numVariations > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Catalog Output Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isGenerating && (
            <div style={styles.resultsContainer}>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>Cleaning Product Photo</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{generationStep}</span>
              </div>

              <div className="variations-grid" style={styles.grid}>
                {styleNames.slice(0, numVariations).map((name, i) => (
                  <div key={i} style={styles.skeletonCard}>
                    <span className="material-symbols-outlined spinner-icon" style={{ fontSize: '32px', color: 'var(--accent)' }}>sync</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Preparing {name}...</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isGenerating && variations.length > 0 && (
            <div style={styles.resultsContainer}>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>Clean Catalog Outputs</h3>
                <div style={styles.actionsRow}>
                  <button
                    onClick={handleRegenerateAll}
                    disabled={isAddingToCatalog}
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
                    Re-clean All
                  </button>

                  <button
                    onClick={handleAddToCatalog}
                    disabled={isAddingToCatalog || variations.filter(v => v.approved).length === 0}
                    className="btn btn-sm btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'var(--success)',
                      borderColor: 'var(--success)',
                      color: 'white',
                    }}
                  >
                    {isAddingToCatalog ? (
                      <>
                        <span className="material-symbols-outlined spinner-icon" style={{ fontSize: 16 }}>sync</span>
                        Creating Draft...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_to_photos</span>
                        Add to Website ({variations.filter(v => v.approved).length})
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="variations-grid" style={styles.grid}>
                {variations.map((v, i) => (
                  <div key={i} style={{ ...styles.card, opacity: v.approved ? 1 : 0.6 }}>
                    {/* Card overlay controls */}
                    <div style={styles.cardHeader}>
                      <span style={styles.badge}>{styleNames[i]}</span>
                      <button
                        onClick={() => handleToggleApprove(i)}
                        disabled={v.isRegenerating || isAddingToCatalog}
                        style={{
                          ...styles.approveCheckbox,
                          background: v.approved ? 'var(--success)' : 'white',
                          color: v.approved ? 'white' : 'var(--text-muted)',
                        }}
                        title={v.approved ? 'Approved' : 'Approve image'}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {v.approved ? 'check' : 'add'}
                        </span>
                      </button>
                    </div>

                    {/* Image display */}
                    <div style={styles.imageContainer}>
                      {v.isRegenerating ? (
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.8)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                          zIndex: 1,
                        }}>
                          <span className="material-symbols-outlined spinner-icon" style={{ fontSize: '28px', color: 'var(--accent)' }}>sync</span>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>Rebuilding...</span>
                        </div>
                      ) : null}
                      <img src={v.url} alt={`${styleNames[i]} catalog output`} style={styles.generatedImage} />
                    </div>

                    {/* Card Actions */}
                    <div style={styles.cardBody}>
                      <div style={styles.cardStyleName}>{styleNames[i]} Output</div>
                      <div style={styles.cardActions}>
                        <button
                          style={{
                            ...styles.cardBtn,
                            ...styles.regenerateBtn,
                          }}
                          onClick={() => handleRegenerateSingle(i)}
                          disabled={v.isRegenerating || isAddingToCatalog}
                          title="Rebuild this catalog output from the same cleaned product"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                          Rebuild
                        </button>

                        <button
                          style={styles.cardBtn}
                          onClick={() => handleDownload(v.url, i)}
                          disabled={v.isRegenerating || isAddingToCatalog}
                          title="Download Image"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isGenerating && variations.length === 0 && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '64px 32px',
              textAlign: 'center',
              color: 'var(--text-faint)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--border)', marginBottom: '16px', display: 'block' }}>auto_awesome</span>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Your Studio is Ready</h3>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '14px', lineHeight: 1.5 }}>
                Upload a casual product image on the left, pick the corresponding category, and create clean catalog outputs from one paid background cleanup.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

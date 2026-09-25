import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Film,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';
import { MediaService, type VideoUploadProgress } from '@shared/services/mediaService';

interface AdminVideoUploaderProps {
  videoUrl?: string;
  videoPublicId?: string;
  videoPosterUrl?: string;
  videoDuration?: number;
  dishName: string;
  posterFallbackUrl?: string;
  onChange: (media: {
    videoUrl?: string;
    videoPublicId?: string;
    videoPosterUrl?: string;
    videoDuration?: number;
    videoStatus?: 'READY' | 'ERROR' | 'PROCESSING';
    previousPublicId?: string;
  }) => void;
  disabled?: boolean;
}

export const AdminVideoUploader: React.FC<AdminVideoUploaderProps> = ({
  videoUrl = '',
  videoPublicId = '',
  videoPosterUrl = '',
  videoDuration = 0,
  dishName,
  posterFallbackUrl = '',
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Local selection & preview states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');
  const [localMetadata, setLocalMetadata] = useState<{ duration: number; width: number; height: number } | null>(null);

  // Upload lifecycle states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadBytes, setUploadBytes] = useState<{ loaded: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Manual URL override accordion
  const [showManualInputs, setShowManualInputs] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>(videoUrl);
  const [manualPoster, setManualPoster] = useState<string>(videoPosterUrl);

  // Drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [localPreviewUrl]);

  // Sync manual inputs with props
  useEffect(() => {
    setManualUrl(videoUrl);
    setManualPoster(videoPosterUrl);
  }, [videoUrl, videoPosterUrl]);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    // 1. Validate file format and size limit (<= 50 MB)
    const validation = MediaService.validateVideoFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    // 2. Generate local object URL for immediate pre-upload playback
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    setSelectedFile(file);

    // 3. Extract duration and dimensions
    const meta = await MediaService.getVideoMetadata(file);
    setLocalMetadata(meta);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadBytes(null);
    setUploadError(null);
    setUploadSuccess(false);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await MediaService.uploadVideoToCloudinary(selectedFile, {
        signal: abortController.signal,
        folder: 'tronx/dishes',
        onProgress: (progress: VideoUploadProgress) => {
          setUploadProgress(progress.percent);
          setUploadBytes({ loaded: progress.loaded, total: progress.total });
        },
      });

      // Successful upload: inform parent of new metadata
      setUploadSuccess(true);
      setIsUploading(false);

      const oldPublicId = videoPublicId;
      onChange({
        videoUrl: result.videoUrl,
        videoPublicId: result.videoPublicId,
        videoPosterUrl: result.videoPosterUrl,
        videoDuration: result.videoDuration || localMetadata?.duration || 0,
        videoStatus: 'READY',
        previousPublicId: oldPublicId || undefined,
      });

      // Clear local file selection
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl('');
      }
      setSelectedFile(null);
    } catch (err: any) {
      setIsUploading(false);
      if (err.name === 'AbortError') {
        setUploadError('Upload cancelled by user.');
      } else {
        setUploadError(err.message || 'Video upload failed. Please verify credentials or network.');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const removeVideo = () => {
    const oldPublicId = videoPublicId;
    setSelectedFile(null);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl('');
    }
    setUploadError(null);
    setUploadSuccess(false);

    onChange({
      videoUrl: '',
      videoPublicId: '',
      videoPosterUrl: '',
      videoDuration: 0,
      videoStatus: undefined,
      previousPublicId: oldPublicId || undefined,
    });
  };

  const applyManualOverride = () => {
    onChange({
      videoUrl: manualUrl.trim(),
      videoPosterUrl: manualPoster.trim(),
      videoPublicId: manualUrl.includes('cloudinary') ? videoPublicId : undefined,
      videoStatus: manualUrl.trim() ? 'READY' : undefined,
    });
  };

  const activeVideoSrc = localPreviewUrl || videoUrl;
  const isCloudinary = videoUrl.includes('cloudinary.com');

  return (
    <div className="space-y-3 bg-[#FAF2EA] border border-[#E8D9CC] rounded-2xl p-4 text-[#241416]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#602E31]" />
          <span className="font-bold uppercase text-[11px] tracking-wider text-[#241416]">
            Dish Video Asset
          </span>
          {videoUrl ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#602E31]/10 text-[#602E31] border border-[#602E31]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#602E31] animate-pulse" />
              Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#E8D9CC]/50 text-[#7E6568]">
              Static Photo Mode
            </span>
          )}
        </div>

        {videoUrl && !isUploading && (
          <button
            type="button"
            onClick={removeVideo}
            disabled={disabled}
            className="text-[10px] text-[#C2674F] font-bold uppercase hover:text-[#C2674F]/80 cursor-pointer flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Remove Video
          </button>
        )}
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-[#C2674F]/10 border border-[#C2674F]/20 p-3 rounded-xl text-xs text-[#C2674F] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#C2674F] mt-0.5 shrink-0" />
          <div className="flex-1 space-y-1">
            <p className="font-bold text-[11px]">Upload Issue</p>
            <p className="text-[11px] leading-relaxed text-[#C2674F]">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-[#C2674F] hover:opacity-75 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Success Banner */}
      {uploadSuccess && (
        <div className="bg-[#FAF2EA] border border-[#602E31]/30 p-2.5 rounded-xl text-xs text-[#602E31] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#602E31] shrink-0" />
            <span className="text-[11px] font-medium">Video uploaded & optimized successfully via Cloudinary!</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadSuccess(false)}
            className="text-[#602E31] hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Video Player or Local Pre-upload Preview */}
      {activeVideoSrc ? (
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden bg-black border border-[#E8D9CC] shadow-inner">
            <video
              key={activeVideoSrc}
              src={activeVideoSrc}
              poster={videoPosterUrl || posterFallbackUrl}
              controls
              muted
              playsInline
              className="w-full max-h-52 object-contain mx-auto"
            />
            {localPreviewUrl && (
              <div className="absolute top-2 left-2 bg-[#C2674F]/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                Local File Preview (Pending Upload)
              </div>
            )}
          </div>

          {/* Local file action buttons */}
          {selectedFile && !isUploading && (
            <div className="bg-white border border-[#E8D9CC] p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-xs">
                <p className="font-bold text-[#241416] truncate max-w-[260px]">{selectedFile.name}</p>
                <p className="text-[10px] text-[#7E6568]">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  {localMetadata?.duration ? ` • ${localMetadata.duration}s` : ''}
                  {localMetadata?.width ? ` • ${localMetadata.width}×${localMetadata.height}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                    setLocalPreviewUrl('');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#E8D9CC] text-[#7E6568] hover:bg-[#FAF2EA] text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startUpload}
                  className="px-4 py-1.5 rounded-lg bg-[#602E31] hover:bg-[#4D2326] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Upload Now
                </button>
              </div>
            </div>
          )}

          {/* Cloudinary Metadata Summary */}
          {videoUrl && !selectedFile && !isUploading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-[#7E6568] bg-white p-2.5 rounded-xl border border-[#E8D9CC]">
              <div className="truncate">
                <span className="text-[#7E6568]/70">Provider:</span> {isCloudinary ? 'Cloudinary (Optimized)' : 'External CDN'}
              </div>
              {videoPublicId && (
                <div className="truncate">
                  <span className="text-[#7E6568]/70">Public ID:</span> {videoPublicId}
                </div>
              )}
              {videoDuration ? (
                <div>
                  <span className="text-[#7E6568]/70">Duration:</span> {videoDuration}s
                </div>
              ) : null}
              <div>
                <span className="text-[#7E6568]/70">Optimization:</span> q_auto, vc_auto, f_auto
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Uploading State: Progress Bar & Cancellation */}
      {isUploading && (
        <div className="bg-white border border-[#E8D9CC] p-4 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-[#241416]">
              <Loader2 className="w-4 h-4 animate-spin text-[#602E31]" />
              <span>Uploading & Optimizing Video ({uploadProgress}%)</span>
            </div>
            <button
              type="button"
              onClick={cancelUpload}
              className="text-[10px] text-[#C2674F] font-bold uppercase hover:text-[#C2674F]/80 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#FAF2EA] rounded-full h-2.5 overflow-hidden border border-[#E8D9CC]">
            <div
              className="bg-[#602E31] h-full transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#7E6568] font-mono">
            <span>
              {uploadBytes ? `${(uploadBytes.loaded / (1024 * 1024)).toFixed(1)} MB / ${(uploadBytes.total / (1024 * 1024)).toFixed(1)} MB` : 'Processing stream...'}
            </span>
            <span>Cloudinary Direct Secure Ingest</span>
          </div>
        </div>
      )}

      {/* Dropzone File Picker (Shown when not uploading and no local file staged) */}
      {!selectedFile && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#602E31] bg-[#FAF2EA] scale-[0.99]'
              : 'border-[#E8D9CC] hover:border-[#602E31] bg-white hover:bg-[#FAF2EA]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-m4v"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
            <div className="w-9 h-9 rounded-xl bg-[#FAF2EA] border border-[#E8D9CC] flex items-center justify-center text-[#602E31] shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#241416]">
                {videoUrl ? `Upload Replacement Video for ${dishName}` : `Choose Local Video File for ${dishName}`}
              </p>
              <p className="text-[10px] text-[#7E6568]">
                Drag & drop MP4, WebM, or MOV here (Max 50 MB)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#602E31] hover:bg-[#4D2326] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs mt-1">
              Select Video
            </span>
          </div>
        </div>
      )}

      {/* Manual URL Accordion (Optional Direct URL / Poster Config) */}
      <div className="pt-2 border-t border-[#E8D9CC]">
        <button
          type="button"
          onClick={() => setShowManualInputs(!showManualInputs)}
          className="text-[10px] text-[#7E6568] font-bold uppercase hover:text-[#241416] flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showManualInputs ? 'Hide Direct URL Inputs' : 'Direct URL / Custom Poster'}
        </button>

        {showManualInputs && (
          <div className="space-y-2 pt-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-[#7E6568] font-medium">Direct Video URL</label>
              <input
                type="url"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/.../video.mp4"
                className="w-full bg-white border border-[#E8D9CC] rounded-lg px-2.5 py-1.5 text-xs text-[#241416] focus:outline-none focus:border-[#602E31]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#7E6568] font-medium">Custom Poster Frame URL</label>
              <input
                type="url"
                value={manualPoster}
                onChange={(e) => setManualPoster(e.target.value)}
                placeholder="https://.../poster.jpg"
                className="w-full bg-white border border-[#E8D9CC] rounded-lg px-2.5 py-1.5 text-xs text-[#241416] focus:outline-none focus:border-[#602E31]"
              />
            </div>
            <button
              type="button"
              onClick={applyManualOverride}
              className="px-3 py-1 rounded-md bg-[#E8D9CC] hover:bg-[#E8D9CC]/70 text-[10px] font-bold uppercase text-[#241416] cursor-pointer"
            >
              Apply Direct URLs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

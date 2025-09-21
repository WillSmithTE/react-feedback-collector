import React, { useRef, useState } from "react";
import { ScreenshotData, WidgetTheme } from "../types";

interface ScreenshotUploadProps {
  screenshots: ScreenshotData[];
  onScreenshotsChange: (screenshots: ScreenshotData[]) => void;
  theme: WidgetTheme;
  baseUrl: string;
  clientId: string;
}

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
  screenshots,
  onScreenshotsChange,
  theme,
  baseUrl,
  clientId,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadError("Image files only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Max 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("screenshot", file);
      formData.append("clientId", clientId);

      const response = await fetch(`${baseUrl}/api/screenshots`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.success && result.screenshot) {
        // Add the new screenshot to the list
        onScreenshotsChange([...screenshots, result.screenshot]);
      }
    } catch (error) {
      console.error("Screenshot upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(newScreenshots);
  };

  return (
    <div className="fb-up">
      {/* Upload Button */}
      <div style={{ marginBottom: "8px" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || screenshots.length >= 3}
          className={`fb-upb ${isUploading || screenshots.length >= 3 ? "fb-upb--dis" : ""}`}
        >
          {isUploading ? (
            <>
              <span className="fb-ups" />
              Uploading...
            </>
          ) : (
            <>📷 Add Screenshot</>
          )}
        </button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="fb-upe">
          ⚠ {uploadError}
        </div>
      )}

      {/* Screenshot Previews */}
      {screenshots.length > 0 && (
        <div className="fb-ss">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="fb-sp">
              <img
                src={screenshot.url}
                alt={`Screenshot ${index + 1}`}
                className="fb-si"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(index)}
                aria-label="Remove screenshot"
                className="fb-sr"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {screenshots.length >= 3 && (
        <div className="fb-sl">
          Maximum 3 screenshots allowed
        </div>
      )}

    </div>
  );
};

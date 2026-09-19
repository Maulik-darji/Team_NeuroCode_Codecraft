/**
 * Zero-Cost Client-Side WebP Image Compressor
 * Converts any user-uploaded image file (JPEG, PNG, WEBP) into a highly optimized,
 * compact WebP Data URL (600px max width, ~20-30KB) that can be stored directly
 * in Firestore without requiring paid Firebase Storage buckets.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const compressImageToWebP = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  const { maxWidth = 600, maxHeight = 600, quality = 0.75 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Draw onto HTML Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP Data URL (or JPEG fallback)
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch (e) {
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(fallbackDataUrl);
        }
      };

      img.onerror = (err) => reject(new Error('Failed to load image file into browser element'));
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

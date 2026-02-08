/**
 * Extract a thumbnail image from a video file
 * @param file - The video file to extract thumbnail from
 * @param seekTime - Time in seconds to capture the frame (default: 1)
 * @returns Promise<string> - Data URL of the thumbnail image
 */
export async function extractVideoThumbnail(
  file: File,
  seekTime: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      // Create object URL from file
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      // When metadata is loaded, seek to the desired time
      video.onloadedmetadata = () => {
        // Seek to specified time or 10% into video, whichever is smaller
        const time = Math.min(seekTime, video.duration * 0.1);
        video.currentTime = time;
      };

      // When seeked to the frame, capture it
      video.onseeked = () => {
        try {
          // Create canvas to draw the frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Draw the video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert canvas to data URL (JPEG for smaller size)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

          // Cleanup
          URL.revokeObjectURL(objectUrl);
          video.remove();

          resolve(dataUrl);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          video.remove();
          reject(err);
        }
      };

      // Error handlers
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        video.remove();
        reject(new Error('Failed to load video'));
      };
    } catch (err) {
      reject(err);
    }
  });
}

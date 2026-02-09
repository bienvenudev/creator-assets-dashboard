export async function extractVideoThumbnail(
  file: File,
  seekTime: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      video.onloadedmetadata = () => {
        const time = Math.min(seekTime, video.duration * 0.1);
        video.currentTime = time;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

          URL.revokeObjectURL(objectUrl);
          video.remove();
          resolve(dataUrl);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          video.remove();
          reject(err);
        }
      };

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

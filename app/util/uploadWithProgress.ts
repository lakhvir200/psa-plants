// utils/uploadWithProgress.ts

/**
 * Uploads a PDF file with progress tracking and optional metadata fields.
 * @param file - PDF File object
 * @param onProgress - Callback to report progress percent
 * @param metadata - Additional form fields like psa_id, service_date, remarks
 * @returns Promise resolving to API response (e.g. file_url)
 */
export function uploadWithProgress(
  file: File,
  onProgress: (percent: number) => void,
  metadata: { [key: string]: string }
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== "application/pdf") {
      return reject(new Error("Only PDF files are allowed."));
    }

    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error("File must be 5MB or less."));
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/service-report", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload network error"));

    const formData = new FormData();
    formData.append("file", file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    xhr.send(formData);
  });
}

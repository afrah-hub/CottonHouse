/**
 * cloudinary.js — Cloudinary upload service
 *
 * Uses the Cloudinary unsigned upload REST API so that no secret key is
 * needed on the frontend. The upload preset must be configured in your
 * Cloudinary dashboard as "Unsigned":
 *   Settings → Upload → Upload Presets → Add preset → Signing Mode: Unsigned
 *
 * Environment variables (set in .env):
 *   VITE_CLOUDINARY_CLOUD_NAME    — your cloud name (e.g. dwlo2jqok)
 *   VITE_CLOUDINARY_UPLOAD_PRESET — unsigned upload preset name
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a File object to Cloudinary using the unsigned upload endpoint.
 *
 * @param {File} file         — The image File to upload
 * @param {string} [folder]   — Optional subfolder in your Cloudinary account (e.g. "products")
 * @returns {Promise<string>} — The secure HTTPS URL of the uploaded image
 * @throws {Error}            — If the upload fails
 */
export async function uploadImageToCloudinary(file, folder = 'cottonhouse/products') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Cloudinary upload failed with status ${response.status}`
    );
  }

  const data = await response.json();

  // Return the secure_url — always HTTPS
  return data.secure_url;
}

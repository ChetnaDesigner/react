const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const MAX_SIZE_MB = 5;

export function validateImageFile(file) {
  if (!file) {
    return "Please select an image file.";
  }

  if (!file.type.startsWith("image/") || !ALLOWED_TYPES.includes(file.type)) {
    return "Only image files are allowed (JPG, PNG, GIF, WebP, SVG).";
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_SIZE_MB}MB.`;
  }

  return "";
}

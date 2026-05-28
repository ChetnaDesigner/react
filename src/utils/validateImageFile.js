const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const MAX_SIZE_MB = 5;

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|gif|webp|svg)$/i;

export function validateImageFile(file) {
  if (!file) {
    return "Please select an image file.";
  }

  const hasAllowedMime =
    file.type.startsWith("image/") && ALLOWED_TYPES.includes(file.type);
  const hasAllowedExtension = ALLOWED_EXTENSIONS.test(file.name);

  if (!hasAllowedMime && !hasAllowedExtension) {
    return "Only image files are allowed (JPG, PNG, GIF, WebP, SVG).";
  }

  if (file.type && !file.type.startsWith("image/")) {
    return "Only image files are allowed (JPG, PNG, GIF, WebP, SVG).";
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_SIZE_MB}MB.`;
  }

  return "";
}

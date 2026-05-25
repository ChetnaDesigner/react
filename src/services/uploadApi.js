const UPLOAD_URL = "/api/upload";
const MAX_SIZE_MB = 5;

export async function uploadImageToApi(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select an image file (JPG, PNG, GIF, etc.).");
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
  }

  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  const url = (await response.text()).trim();

  if (!url.startsWith("http")) {
    throw new Error(url || "Upload failed. Server returned an invalid response.");
  }

  return url;
}

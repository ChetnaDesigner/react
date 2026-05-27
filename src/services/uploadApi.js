import { validateImageFile } from "../utils/validateImageFile";

const UPLOAD_URL = "/api/upload";

export async function uploadImageToApi(file) {
  const validationMessage = validateImageFile(file);
  if (validationMessage) {
    throw new Error(validationMessage);
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

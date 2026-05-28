import { useEffect, useRef, useState } from "react";
import ImagePreviewModal from "../components/ImagePreviewModal";
import { uploadImageToApi } from "../services/uploadApi";
import { validateImageFile } from "../utils/validateImageFile";

function initialsFromName(name) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ApiDemoPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [uploadValidationError, setUploadValidationError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadApiError, setUploadApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const latestPreviewUrlRef = useRef("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    setUploadedPhoto((prev) => {
      if (!prev || prev.assignedUserId != null) return prev;
      return { ...prev, assignedUserId: users[0].id };
    });
  }, [users]);

  useEffect(() => {
    return () => {
      if (latestPreviewUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(latestPreviewUrlRef.current);
      }
    };
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch {
      setError("Something went wrong while fetching users.");
    } finally {
      setLoading(false);
    }
  }

  function clearUploadedPhoto() {
    setUploadedPhoto((prev) => {
      if (prev?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      latestPreviewUrlRef.current = "";
      return null;
    });
    setUploadValidationError("");
    setUploadApiError("");
    setIsPreviewModalOpen(false);
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      clearUploadedPhoto();
      setUploadValidationError(validationMessage);
      return;
    }

    setUploadValidationError("");
    setUploadApiError("");

    const previewUrl = URL.createObjectURL(file);
    const defaultUserId = users[0]?.id ?? null;

    setUploadedPhoto((prev) => {
      if (prev?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      latestPreviewUrlRef.current = previewUrl;
      return {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl,
        apiUrl: "",
        assignedUserId: prev?.assignedUserId ?? defaultUserId,
      };
    });

    setUploading(true);

    try {
      const apiUrl = await uploadImageToApi(file);
      setUploadedPhoto((prev) =>
        prev ? { ...prev, apiUrl } : null
      );
    } catch (err) {
      setUploadApiError(
        err.message || "API upload failed. Preview is still shown from local file."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleAssignUser(userId) {
    setUploadedPhoto((prev) =>
      prev ? { ...prev, assignedUserId: Number(userId) || null } : null
    );
  }

  function getPhotoUrlForUser(userId) {
    if (
      !uploadedPhoto ||
      Number(uploadedPhoto.assignedUserId) !== Number(userId)
    ) {
      return null;
    }
    return uploadedPhoto.previewUrl || uploadedPhoto.apiUrl || null;
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayImageUrl =
    uploadedPhoto?.previewUrl || uploadedPhoto?.apiUrl || "";

  const assignedUser = users.find(
    (user) => Number(user.id) === Number(uploadedPhoto?.assignedUserId)
  );

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">API Demo</h1>
        <p className="contact-manager__subtitle">
          Upload an image (validated), store it in React state, and attach it to a
          user card below.
        </p>
      </header>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">Upload</span>
          <h2 className="contact-form__title">Photo upload</h2>
          <p className="contact-form__hint">
            Only image files (JPG, PNG, GIF, WebP, SVG). Max 5MB. Preview appears
            instantly; file is also sent to upload API.
          </p>
        </header>

        <div className="contact-form__field">
          <label htmlFor="api-photo" className="contact-form__label">
            Upload photo
          </label>
          <input
            id="api-photo"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className={`contact-form__input contact-form__input--file${uploadValidationError ? " contact-form__input--error" : ""}`}
            onChange={handleImageUpload}
            disabled={uploading}
            aria-invalid={Boolean(uploadValidationError)}
            aria-describedby={
              uploadValidationError ? "api-photo-error" : undefined
            }
          />
          {uploadValidationError && (
            <p id="api-photo-error" className="contact-form__error" role="alert">
              {uploadValidationError}
            </p>
          )}
        </div>

        {uploading && (
          <p className="api-upload-status">Uploading to API…</p>
        )}

        {uploadApiError && (
          <div className="contact-form__alert" role="alert">
            {uploadApiError}
          </div>
        )}

        {uploadedPhoto && displayImageUrl && (
          <div className="api-upload-success">
            <div className="api-upload-success__header">
              <p className="api-upload-success__text">
                <strong>{uploadedPhoto.fileName}</strong> stored in React state
                {uploadedPhoto.apiUrl ? " · uploaded via API" : " · local preview"}
              </p>
              <button
                type="button"
                className="api-upload-remove"
                onClick={clearUploadedPhoto}
              >
                Remove photo
              </button>
            </div>

            <div className="api-image-preview">
              <p className="api-image-preview__label">Preview</p>
              <button
                type="button"
                className="api-image-preview__button"
                onClick={() => setIsPreviewModalOpen(true)}
                aria-label="Open image preview in modal"
              >
                <img
                  src={displayImageUrl}
                  alt={uploadedPhoto.fileName}
                />
              </button>
              <p className="contact-form__hint api-image-preview__hint">
                Click preview to open full size
              </p>
            </div>

            <p className="api-upload-meta">
              Type: {uploadedPhoto.fileType} · Size:{" "}
              {(uploadedPhoto.fileSize / 1024).toFixed(1)} KB
            </p>

            {users.length > 0 && (
              <div className="contact-form__field api-assign-user">
                <label htmlFor="api-assign-user" className="contact-form__label">
                  Show photo on user
                </label>
                <select
                  id="api-assign-user"
                  className="contact-form__input"
                  value={uploadedPhoto.assignedUserId ?? ""}
                  onChange={(e) => handleAssignUser(e.target.value)}
                >
                  <option value="">— Select a user —</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <p className="contact-form__hint api-assign-hint">
                  The selected user&apos;s card will display this uploaded photo.
                </p>
              </div>
            )}

            {assignedUser && (
              <div className="api-user-detail-preview">
               
                <div className="api-user-detail-preview__card">
                  <img
                    className="api-user-detail-preview__photo"
                    src={displayImageUrl}
                    alt={assignedUser.name}
                  />
                  <div className="api-user-detail-preview__info">
                    <h3 className="api-user-detail-preview__name">{assignedUser.name}</h3>
                    <p className="api-user-detail-preview__meta">{assignedUser.email}</p>
                    <p className="api-user-detail-preview__meta">{assignedUser.phone}</p>
                    <p className="api-user-detail-preview__meta">{assignedUser.address.city}</p>
                    <p className="api-user-detail-preview__meta">{assignedUser.company.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">API data</span>
          <h2 className="contact-form__title">Users from public API</h2>
          <p className="contact-form__hint">
            Data loaded from JSONPlaceholder. Assigned photo appears on the
            selected user card.
          </p>
        </header>

        <div className="contact-search">
          <label htmlFor="api-user-search" className="contact-search__label">
            Search users
          </label>
          <input
            id="api-user-search"
            className="contact-search__input"
            type="search"
            placeholder="Search by name…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <p className="api-users-count">
          <span className="contact-list-section__count">{filteredUsers.length}</span>
          {" "}users found
        </p>

        {error && (
          <div className="contact-form__alert" role="alert">
            {error}
          </div>
        )}

        {loading && <p className="no-contacts">Loading users from API…</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <p className="no-contacts">No users match your search.</p>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="contact-list api-user-list">
            {filteredUsers.map((user) => {
              const userPhoto = getPhotoUrlForUser(user.id);

              return (
                <article
                  className={`contact-card${userPhoto ? " contact-card--has-photo" : ""}`}
                  key={user.id}
                >
                
                  <div className="contact-card__body">
                    {userPhoto && (
                      <div className="api-user-card-photo">
                        <img
                          className="api-user-card-photo__img"
                          src={userPhoto}
                          alt={user.name}
                        />
                     
                      </div>
                    )}
                     <div className="contact-card__avatar">
                      {initialsFromName(user.name)}
                    </div>
                    <h3 className="contact-card__name">{user.name}</h3>
                    <p className="contact-card__meta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 6h16v12H4V6zm8 5.5L5.5 8h13L12 11.5z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {user.email}
                    </p>
                    <p className="contact-card__meta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M6.5 4h3l1.5 4-2 1.5c1.2 2.4 3.1 4.3 5.5 5.5L17.5 13l4 1.5v3c0 .8-.7 1.5-1.5 1.5C10.5 19 5 13.5 5 6.5 5 5.7 5.7 5 6.5 4z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {user.phone}
                    </p>
                    <p className="contact-card__meta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      {user.address.city}
                    </p>
                    <p className="contact-card__meta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 7h16v10H4V7zm2 2v6h12V9H6z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      {user.company.name}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ImagePreviewModal
        open={isPreviewModalOpen}
        imageUrl={displayImageUrl}
        title={uploadedPhoto?.fileName || "Photo preview"}
        onClose={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
}

export default ApiDemoPage;

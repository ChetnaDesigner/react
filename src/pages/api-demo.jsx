import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedPhoto?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedPhoto.previewUrl);
      }
    };
  }, [uploadedPhoto]);

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
      return null;
    });
    setUploadValidationError("");
    setUploadApiError("");
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

    setUploadedPhoto((prev) => {
      if (prev?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl,
        apiUrl: "",
        assignedUserId: prev?.assignedUserId ?? null,
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

  function getPhotoForUser(userId) {
    if (!uploadedPhoto || uploadedPhoto.assignedUserId !== userId) {
      return null;
    }
    return uploadedPhoto.apiUrl || uploadedPhoto.previewUrl;
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayImageUrl =
    uploadedPhoto?.apiUrl || uploadedPhoto?.previewUrl || "";

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">API Demo</h1>
        <p className="contact-manager__subtitle">
          Fetch users from a public API, upload a photo with preview, and attach
          it to a user card.
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
              <img src={displayImageUrl} alt={`Preview of ${uploadedPhoto.fileName}`} />
            </div>

            <p className="api-upload-meta">
              Type: {uploadedPhoto.fileType} · Size:{" "}
              {(uploadedPhoto.fileSize / 1024).toFixed(1)} KB
            </p>

            {users.length > 0 && (
              <div className="contact-form__field api-assign-user">
                <label htmlFor="api-assign-user" className="contact-form__label">
                  Attach photo to user
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
                  The selected user&apos;s card will show this photo instead of
                  initials.
                </p>
              </div>
            )}

            {uploadedPhoto.apiUrl && (
              <a
                className="api-upload-success__link"
                href={uploadedPhoto.apiUrl}
                target="_blank"
                rel="noreferrer"
              >
                View on API: {uploadedPhoto.apiUrl}
              </a>
            )}
          </div>
        )}
      </section>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">API data</span>
          <h2 className="contact-form__title">Users from public API</h2>
          <p className="contact-form__hint">
            Data loaded from JSONPlaceholder. Uploaded photo appears on the
            assigned user card.
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
          users found
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
              const userPhoto = getPhotoForUser(user.id);

              return (
                <article
                  className={`contact-card${userPhoto ? " contact-card--has-photo" : ""}`}
                  key={user.id}
                >
                  <header className="contact-card__header">
                    {userPhoto ? (
                      <div className="contact-card__avatar contact-card__avatar--photo">
                        <img src={userPhoto} alt={user.name} />
                      </div>
                    ) : (
                      <div className="contact-card__avatar">
                        {initialsFromName(user.name)}
                      </div>
                    )}
                  </header>
                  <div className="contact-card__body">
                    <h3 className="contact-card__name">{user.name}</h3>
                    {userPhoto && (
                      <p className="api-user-photo-badge">Uploaded photo attached</p>
                    )}
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
    </div>
  );
}

export default ApiDemoPage;

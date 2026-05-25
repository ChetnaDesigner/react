import { useEffect, useState } from "react";
import { uploadImageToApi } from "../services/uploadApi";

function initialsFromName(name) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ApiDemoPage() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
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

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadedImageUrl("");
    setUploadFileName(file.name);
    setUploading(true);

    try {
      const imageUrl = await uploadImageToApi(file);
      setUploadedImageUrl(imageUrl);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image.");
      setUploadFileName("");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">API Demo</h1>
        <p className="contact-manager__subtitle">
          Fetch users from a public API, search results, and upload a photo via
          API.
        </p>
      </header>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">Upload</span>
          <h2 className="contact-form__title">Photo upload via API</h2>
          <p className="contact-form__hint">
            Image is sent to a public upload API (Catbox). Max size 5MB.
          </p>
        </header>

        <div className="contact-form__field">
          <label htmlFor="api-photo" className="contact-form__label">
            Select image
          </label>
          <input
            id="api-photo"
            type="file"
            accept="image/*"
            className="contact-form__input contact-form__input--file"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>

        {uploading && (
          <p className="api-upload-status">Uploading to API…</p>
        )}

        {uploadError && (
          <div className="contact-form__alert" role="alert">
            {uploadError}
          </div>
        )}

        {uploadedImageUrl && (
          <div className="api-upload-success">
            <p className="api-upload-success__text">
              Uploaded <strong>{uploadFileName}</strong> successfully via API.
            </p>
            <a
              className="api-upload-success__link"
              href={uploadedImageUrl}
              target="_blank"
              rel="noreferrer"
            >
              {uploadedImageUrl}
            </a>
            <div className="api-image-preview">
              <img src={uploadedImageUrl} alt="Uploaded via API" />
            </div>
          </div>
        )}
      </section>

      <section className="contact-panel">
        <header className="contact-form__header">
          <span className="contact-form__badge">API data</span>
          <h2 className="contact-form__title">Users from public API</h2>
          <p className="contact-form__hint">
            Data loaded from JSONPlaceholder. Search by name below.
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
            {filteredUsers.map((user) => (
              <article className="contact-card" key={user.id}>
                <header className="contact-card__header">
                  <div className="contact-card__avatar">
                    {initialsFromName(user.name)}
                  </div>
                </header>
                <div className="contact-card__body">
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ApiDemoPage;

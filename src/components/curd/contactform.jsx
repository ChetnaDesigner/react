import { useEffect, useRef, useState } from "react";
import { validateImageFile } from "../../utils/validateImageFile";

const emptyForm = { name: "", phone: "", email: "", address: "" };

function validateForm(data) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  }

  return errors;
}

function ContactForm({ onAdd }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");
  const photoPreviewRef = useRef("");

  useEffect(() => {
    return () => {
      if (photoPreviewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
    };
  }, []);

  function clearPhoto() {
    if (photoPreviewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }
    photoPreviewRef.current = "";
    setPhotoPreviewUrl("");
    setPhotoFileName("");
    if (errors.photo) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      clearPhoto();
      setErrors((prev) => ({ ...prev, photo: validationMessage }));
      return;
    }

    if (photoPreviewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    photoPreviewRef.current = previewUrl;
    setPhotoPreviewUrl(previewUrl);
    setPhotoFileName(file.name);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  }
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (formError) setFormError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormError("Please fix the errors below before adding the contact.");
      return;
    }

    onAdd({
      ...formData,
      photoUrl: photoPreviewUrl || "",
      photoFileName: photoFileName || "",
    });

    photoPreviewRef.current = "";
    setPhotoPreviewUrl("");
    setPhotoFileName("");
    setFormData(emptyForm);
    setErrors({});
    setFormError("");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <header className="contact-form__header">
        <span className="contact-form__badge">New entry</span>
        <h2 className="contact-form__title">Add a contact</h2>
        <p className="contact-form__hint">
          Fill in the details below. Photo is optional (images only, max 5MB).
        </p>
      </header>

      {formError && (
        <div className="contact-form__alert" role="alert">
          {formError}
        </div>
      )}

      <div className="contact-form__fields">
        <div className="contact-form__field">
          <label htmlFor="contact-name" className="contact-form__label">
            Full name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            className={`contact-form__input${errors.name ? " contact-form__input--error" : ""}`}
            placeholder="e.g. Priya Mehta"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="contact-form__error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-phone" className="contact-form__label">
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            className={`contact-form__input${errors.phone ? " contact-form__input--error" : ""}`}
            placeholder="e.g. +919876543210"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          />
          {errors.phone && (
            <p id="contact-phone-error" className="contact-form__error">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-address" className="contact-form__label">
            Address
          </label>
          <input
            id="contact-address"
            type="text"
            name="address"
            className={`contact-form__input${errors.address ? " contact-form__input--error" : ""}`}
            placeholder="e.g. 12 MG Road, Mumbai"
            value={formData.address}
            onChange={handleChange}
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? "contact-address-error" : undefined}
          />
          {errors.address && (
            <p id="contact-address-error" className="contact-form__error">
              {errors.address}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email" className="contact-form__label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            className={`contact-form__input${errors.email ? " contact-form__input--error" : ""}`}
            placeholder="e.g. name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="contact-form__error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-photo" className="contact-form__label">
            Photo (optional)
          </label>
          <input
            id="contact-photo"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className={`contact-form__input contact-form__input--file${errors.photo ? " contact-form__input--error" : ""}`}
            onChange={handlePhotoChange}
            aria-invalid={Boolean(errors.photo)}
            aria-describedby={errors.photo ? "contact-photo-error" : undefined}
          />
          {errors.photo && (
            <p id="contact-photo-error" className="contact-form__error" role="alert">
              {errors.photo}
            </p>
          )}
          {photoPreviewUrl && (
            <div className="contact-form__photo-preview">
              <img src={photoPreviewUrl} alt={photoFileName || "Contact photo preview"} />
            </div>
          )}
        </div>
      </div>

      {photoPreviewUrl && (
        <div className="contact-entry-preview">
          <p className="api-image-preview__label">Photo with contact details</p>
          <div className="api-user-detail-preview__card">
            <img
              className="api-user-detail-preview__photo"
              src={photoPreviewUrl}
              alt={formData.name || photoFileName || "Contact photo"}
            />
            <div className="api-user-detail-preview__info">
              <h3 className="api-user-detail-preview__name">
                {formData.name.trim() || "Name (required)"}
              </h3>
              <p className="api-user-detail-preview__meta">
                {formData.email.trim() || "Email (required)"}
              </p>
              <p className="api-user-detail-preview__meta">
                {formData.phone.trim() || "Phone (required)"}
              </p>
              <p className="api-user-detail-preview__meta">
                {formData.address.trim() || "Address (required)"}
              </p>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="contact-form__submit">
        Add contact
      </button>
    </form>
  );
}

export default ContactForm;

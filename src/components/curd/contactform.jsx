import { useState } from "react";

const emptyForm = { name: "", phone: "", email: "" };

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

  return errors;
}

function ContactForm({ onAdd }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
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

    onAdd(formData);
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
          Fill in the details below. All fields are required.
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
      </div>

      <button type="submit" className="contact-form__submit">
        Add contact
      </button>
    </form>
  );
}

export default ContactForm;

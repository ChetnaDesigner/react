import { useState } from "react";

function ContactForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all fields");
      return;
    }

    onAdd(formData);

    setFormData({
      name: "",
      phone: "",
      email: "",
    });
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <header className="contact-form__header">
        <span className="contact-form__badge">New entry</span>
        <h2 className="contact-form__title">Add a contact</h2>
        <p className="contact-form__hint">
          Fill in the details below. All fields are required.
        </p>
      </header>

      <div className="contact-form__fields">
        <div className="contact-form__field">
          <label htmlFor="contact-name" className="contact-form__label">
            Full name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            className="contact-form__input"
            placeholder="e.g. Priya Mehta"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-phone" className="contact-form__label">
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            className="contact-form__input"
            placeholder="e.g. +919876543210"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email" className="contact-form__label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            className="contact-form__input"
            placeholder="e.g. name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>
      </div>

      <button type="submit" className="contact-form__submit">
        Add contact
      </button>
    </form>
  );
}

export default ContactForm;

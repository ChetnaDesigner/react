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
      <input
        type="text"
        name="name"
        className="form-control"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
         className="form-control"
        placeholder="Enter phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        className="form-control"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />

      <button type="submit" className="btn btn-primary">Add Contact</button>
    </form>
  );
}

export default ContactForm;
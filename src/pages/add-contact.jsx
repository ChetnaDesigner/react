import ContactForm from "../components/curd/contactform";
import { useContacts } from "../context/ContactContext";

function AddContactPage() {
  const { addContact } = useContacts();

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">Add Contact</h1>
        <p className="contact-manager__subtitle">
          Fill in the details to save a new contact.
        </p>
      </header>

      <ContactForm onAdd={addContact} />
    </div>
  );
}

export default AddContactPage;

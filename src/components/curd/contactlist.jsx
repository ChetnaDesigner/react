import { useState } from "react";
import Card from "./card";
import ConfirmModal from "./ConfirmModal";

function ContactList({ contacts, onDelete }) {
  const [contactToDelete, setContactToDelete] = useState(null);

  function handleConfirmDelete() {
    if (contactToDelete) {
      onDelete(contactToDelete.id);
      setContactToDelete(null);
    }
  }

  function handleCancelDelete() {
    setContactToDelete(null);
  }

  if (contacts.length === 0) {
    return <p className="no-contacts">No contacts found</p>;
  }

  return (
    <section className="contact-list-section">
      <h2 className="contact-list-section__title">
        Your contacts
        <span className="contact-list-section__count">{contacts.length}</span>
      </h2>
      <div className="contact-list">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            id={contact.id}
            name={contact.name}
            phone={contact.phone}
            email={contact.email}
            address={contact.address}
            photoUrl={contact.photoUrl}
            onDeleteClick={setContactToDelete}
          />
        ))}
      </div>

      <ConfirmModal
        open={Boolean(contactToDelete)}
        title="Delete contact?"
        message={
          contactToDelete
            ? `Are you sure you want to remove ${contactToDelete.name}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Yes"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}

export default ContactList;

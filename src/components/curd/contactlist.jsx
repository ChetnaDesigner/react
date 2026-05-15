import Card from "./card";

function ContactList({ contacts, onDelete }) {
  if (contacts.length === 0) {
    return <p className="no-contacts">No contacts found</p>;
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <Card key={contact.id} {...contact} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default ContactList;
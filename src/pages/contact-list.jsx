import ContactList from "../components/curd/contactlist";
import SearchBar from "../components/curd/searchbar";
import { useContacts } from "../context/ContactContext";

function ContactListPage() {
  const { search, setSearch, filteredContacts, deleteContact, contacts } =
    useContacts();

  return (
    <div className="app contact-manager">
      <header className="contact-manager__header">
        <h1 className="contact-manager__title">Contact List</h1>
        <p className="contact-manager__subtitle">
          {contacts.length === 0
            ? "No contacts yet. Add your first contact from the Add Contact page."
            : `You have ${contacts.length} saved contact${contacts.length === 1 ? "" : "s"}.`}
        </p>
      </header>

      <SearchBar search={search} setSearch={setSearch} />
      <ContactList contacts={filteredContacts} onDelete={deleteContact} />
    </div>
  );
}

export default ContactListPage;

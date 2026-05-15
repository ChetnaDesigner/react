import { useState } from "react";
import ContactForm from "./components/curd/contactform";
import ContactList from "./components/curd/contactlist";
import SearchBar from "./components/curd/searchbar";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  function addContact(newContact) {
    const contactWithId = {
      ...newContact,
      id: Date.now(),
    };
    setContacts((prev) => [...prev, contactWithId]);
  }

  function deleteContact(id) {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }

  const q = search.trim().toLowerCase();
  const filteredContacts = contacts.filter((contact) =>
    (contact.name ?? "").toLowerCase().includes(q)
  );

  return (
    <div className="app">
      <h1>Contact Manager</h1>

      <ContactForm onAdd={addContact} />
      <SearchBar search={search} setSearch={setSearch} />
      <div className="mt-3">
        <ContactList contacts={filteredContacts} onDelete={deleteContact} />
      </div>
    </div>
  );
}

export default App;
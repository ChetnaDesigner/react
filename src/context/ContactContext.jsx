import { createContext, useContext, useMemo, useState } from "react";

const ContactContext = createContext(null);

export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function hideToast() {
    setToast(null);
  }

  function revokeContactPhoto(contact) {
    if (contact?.photoUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(contact.photoUrl);
    }
  }

  function addContact(newContact) {
    const contactWithId = {
      ...newContact,
      id: Date.now(),
    };
    setContacts((prev) => [...prev, contactWithId]);
    setSearch("");
    showToast("Add contact successfully", "success");
    return contactWithId;
  }

  function deleteContact(id) {
    setContacts((prev) => {
      const removed = prev.find(
        (contact) => String(contact.id) === String(id)
      );
      revokeContactPhoto(removed);
      return prev.filter((contact) => String(contact.id) !== String(id));
    });
    showToast("Contact deleted successfully", "success");
  }

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((contact) =>
      (contact.name ?? "").toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const value = {
    contacts,
    search,
    setSearch,
    filteredContacts,
    toast,
    showToast,
    hideToast,
    addContact,
    deleteContact,
  };

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContacts must be used within ContactProvider");
  }
  return context;
}

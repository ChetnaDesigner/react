import { Navigate, Route, Routes } from "react-router";
import ToastAlert from "./components/curd/ToastAlert";
import Navbar from "./components/navbar";
import { ContactProvider, useContacts } from "./context/ContactContext";
import AddContactPage from "./pages/add-contact";
import ContactListPage from "./pages/contact-list";
import ApiDemo from "./pages/api-demo";
import "./App.css";

function AppRoutes() {
  const { toast, hideToast } = useContacts();

  return (
    <>
      <Navbar />
      <ToastAlert toast={toast} onDismiss={hideToast} />
      <Routes>
        <Route path="/" element={<Navigate to="/contacts/add" replace />} />
        <Route path="/contacts/add" element={<AddContactPage />} />
        <Route path="/contacts/list" element={<ContactListPage />} />
        <Route path="/apidemo" element={<ApiDemo />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ContactProvider>
      <AppRoutes />
    </ContactProvider>
  );
}

export default App;

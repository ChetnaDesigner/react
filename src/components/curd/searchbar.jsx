function SearchBar({ search, setSearch }) {
  return (
    <div className="contact-search">
      <label htmlFor="contact-search" className="contact-search__label">
        Search contacts
      </label>
      <input
        id="contact-search"
        className="contact-search__input"
        type="search"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}

export default SearchBar;

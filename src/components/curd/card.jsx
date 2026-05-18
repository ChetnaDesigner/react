function initialsFromTitle(title) {
  const parts = title?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Card({ id, name, phone, email, onDeleteClick }) {
  return (
    <article className="contact-card">
      <header className="contact-card__header">
        <div className="contact-card__avatar">{initialsFromTitle(name)}</div>
        <button
          type="button"
          className="contact-card__delete"
          onClick={() => onDeleteClick?.({ id, name })}
          aria-label={`Delete ${name}`}
        >
          <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
            <path
              fill="currentColor"
              d="M29,7.5c0-1.93-1.57-3.5-3.5-3.5H17V3c0-0.553-0.447-1-1-1s-1,0.447-1,1v1H6.5C4.57,4,3,5.571,3,7.5c0,0.553,0.447,1,1,1 s1-0.447,1-1C5,6.673,5.673,6,6.5,6h19C26.327,6,27,6.673,27,7.5S26.327,9,25.5,9c-0.09,0-0.171,0.029-0.254,0.051 c-0.064-0.017-0.122-0.046-0.19-0.049c-0.02-0.001-0.037,0.008-0.056,0.008L25,9H10.989l0.873,16.412 c0.044,0.828-0.591,1.534-1.418,1.578c-0.014,0-0.027,0.001-0.041,0.001c-0.033-0.002-0.065-0.006-0.097-0.009 c-0.078-0.003-0.15-0.025-0.225-0.041C9.41,26.766,8.9,26.179,8.859,25.455L7.998,9.945c-0.03-0.551-0.487-0.973-1.054-0.942 c-0.551,0.03-0.974,0.502-0.942,1.054l0.861,15.511C6.971,27.493,8.565,29,10.493,29h11.014c1.928,0,3.522-1.508,3.63-3.434 l0.811-14.612C27.665,10.732,29,9.277,29,7.5z"
            />
          </svg>
        </button>
      </header>

      <div className="contact-card__body">
        <h3 className="contact-card__name">{name}</h3>
        <a className="contact-card__link" href={`mailto:${email}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16v12H4V6zm8 5.5L5.5 8h13L12 11.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {email}
        </a>
        <a className="contact-card__link" href={`tel:${phone}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.5 4h3l1.5 4-2 1.5c1.2 2.4 3.1 4.3 5.5 5.5L17.5 13l4 1.5v3c0 .8-.7 1.5-1.5 1.5C10.5 19 5 13.5 5 6.5 5 5.7 5.7 5 6.5 4z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {phone}
        </a>
      </div>
    </article>
  );
}

export default Card;

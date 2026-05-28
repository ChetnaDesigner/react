import { useState } from "react";
import ImagePreviewModal from "../ImagePreviewModal";

function initialsFromTitle(title) {
  const parts = title?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Card({ id, name, phone, email, address, photoUrl, onDeleteClick }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <article
      className={`contact-card contact-card--profile${photoUrl ? " contact-card--has-photo" : ""}`}
    >
      <button
        type="button"
        className="contact-card__delete contact-card__delete--corner"
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

      <div className="contact-card__profile">
        <div className="contact-card__media">
          {photoUrl ? (
            <button
              type="button"
              className="contact-card__photo-btn"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`View photo of ${name}`}
            >
              <img
                className="contact-card__photo"
                src={photoUrl}
                alt={name}
              />
            </button>
          ) : (
            <div className="contact-card__photo contact-card__photo--initials">
              {initialsFromTitle(name)}
            </div>
          )}
        </div>

        <div className="contact-card__details">
          <h3 className="contact-card__name">{name}</h3>

          <dl className="contact-card__fields">
            <div className="contact-card__field">
              <dt className="contact-card__label">Email</dt>
              <dd className="contact-card__value">
                <a className="contact-card__link" href={`mailto:${email}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 6h16v12H4V6zm8 5.5L5.5 8h13L12 11.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{email}</span>
                </a>
              </dd>
            </div>

            <div className="contact-card__field">
              <dt className="contact-card__label">Phone</dt>
              <dd className="contact-card__value">
                <a className="contact-card__link" href={`tel:${phone}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6.5 4h3l1.5 4-2 1.5c1.2 2.4 3.1 4.3 5.5 5.5L17.5 13l4 1.5v3c0 .8-.7 1.5-1.5 1.5C10.5 19 5 13.5 5 6.5 5 5.7 5.7 5 6.5 4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{phone}</span>
                </a>
              </dd>
            </div>

            <div className="contact-card__field">
              <dt className="contact-card__label">Address</dt>
              <dd className="contact-card__value">
                <p className="contact-card__text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>{address?.trim() || "—"}</span>
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <ImagePreviewModal
        open={isPreviewOpen}
        imageUrl={photoUrl}
        title={name}
        onClose={() => setIsPreviewOpen(false)}
      />
    </article>
  );
}

export default Card;

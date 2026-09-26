import "./TheSoupCard.css";
import elaine from "../images/elaine.webp";

const fields = [
  { label: "Name", writing: "Elaine Benes" },
  { label: "Member No.", writing: "EB-0716" },
  { label: "Member since", writing: "1995" },
];

const TheSoupCard = () => {
  return (
    <article className="soup-card rounded-2xl">
      <div className="soup-card-content">
        <header>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-soup preview-icon size-6"
            >
              <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
              <path d="M7 21h10" />
              <path d="M19.5 12 22 6" />
              <path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62" />
              <path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62" />
              <path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62" />
            </svg>
            <span className="soup-title text-2xl font-bold sm:text-3xl">
              Hot Soup
            </span>
          </div>
          <p className="soup-membership text-xs font-semibold sm:text-sm">
            Membership Card
          </p>
        </header>

        <div className="mt-auto">
          {fields.map((field) => (
            <div
              key={field.label}
              className="soup-card-field flex items-center gap-1.5"
            >
              <span className="soup-mono text-sm font-medium capitalize">
                {field.label}:
              </span>
              <div className="flex-1 border-b border-stone-500 text-center">
                <p className="soup-writing text-2xl">{field.writing}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="soup-card-photo-frame">
        <img
          className="soup-card-portrait"
          src={elaine.src}
          width={elaine.width}
          height={elaine.height}
          alt="Elaine Benes"
          decoding="async"
        />
      </div>
    </article>
  );
};

export default TheSoupCard;

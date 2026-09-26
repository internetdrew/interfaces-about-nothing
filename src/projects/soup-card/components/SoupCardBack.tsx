// Edit the back of the membership card here. Flip behavior lives in ElainesSoupCard.
const rules = [
  "Know your order before you reach the counter.",
  "Have your money ready.",
  "Move to the side. Enjoy your soup.",
];

export default function SoupCardBack() {
  return (
    <div className="soup-card-content soup-card-back-content">
      <header>
        <h3 className="soup-title text-2xl font-bold tracking-wide sm:text-3xl">
          The rules of soup
        </h3>
        <p className="soup-membership text-xs font-semibold sm:text-sm">
          Good soup. Strict rules.
        </p>
      </header>
      <ol className="soup-card-back-rules soup-mono">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
      <p className="soup-card-footer soup-writing text-2xl">No soup for you!</p>
    </div>
  );
}

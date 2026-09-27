const infractions = [
  { date: "11/08/95", note: "Requested bread after refusal." },
  { date: "11/11/95", note: "Challenged soup assignment." },
  { date: "12/6/95", note: "Played drums on counter." },
  { date: "", note: "" },
  { date: "", note: "" },
];

export default function SoupCardBack() {
  return (
    <div className="soup-record">
      <div className="flex items-center justify-between">
        <span className="soup-title text-lg font-semibold tracking-wide sm:text-xl">
          Infraction Record
        </span>
        <span className="soup-writing text-lg font-medium">EB-0716</span>
      </div>

      <table className="soup-record-table">
        <caption className="sr-only">Elaine's infraction record</caption>
        <colgroup>
          <col className="soup-record-number" />
          <col className="soup-record-date" />
          <col />
        </colgroup>
        <thead className="soup-mono uppercase">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Date</th>
            <th scope="col">Infraction Noted</th>
          </tr>
        </thead>

        <tbody>
          {infractions.map((infraction, index) => (
            <tr key={index}>
              <th scope="row" className="soup-mono text-center font-medium">
                {String(index + 1).padStart(2, "0")}
              </th>
              <td className="soup-writing">{infraction.date}</td>
              <td className="soup-writing">{infraction.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="soup-record-warning text-2xl font-semibold uppercase">
        Fifth Infraction: One-Year Ban
      </p>
    </div>
  );
}

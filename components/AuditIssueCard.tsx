type AuditIssueCardProps = {
  severity: "low" | "medium" | "high";
  title: string;
  explanation: string;
  fix: string;
};

export default function AuditIssueCard({
  severity,
  title,
  explanation,
  fix,
}: AuditIssueCardProps) {
  return (
    <article>
      <p>{severity}</p>
      <h3>{title}</h3>
      <p>{explanation}</p>
      <p>{fix}</p>
    </article>
  );
}
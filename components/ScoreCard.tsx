type ScoreCardProps = {
  label: string;
  score: number;
};

export default function ScoreCard({
  label,
  score,
}: ScoreCardProps) {
  return (
    <div>
      <p>{label}</p>
      <p>
        {score}
        <span>/100</span>
      </p>
    </div>
  );
}
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function MiniChart({ data }: { data: { timestamp: string; responseTime: number }[] }) {
    console.log("📈 MiniChart data:", data);
    return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
            formatter={(value) => `${value} ms`}
          />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
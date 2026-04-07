import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((value, index) => ({ index, value }));
  const strokeColor = isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 84%, 60%)";

  // Calculate domain with padding to show variance
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1 || max * 0.01;

  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={chartData}>
        <YAxis domain={[min - padding, max + padding]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

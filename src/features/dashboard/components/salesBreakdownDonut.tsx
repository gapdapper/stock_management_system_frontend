import type { IChartData } from "@/types/dashboard";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

type Props = {
  data: IChartData[];
  centerLabel: string;
};

export default function SalesBreakdownDonut({ data, centerLabel }: Props) {
  const COLORS = ["#818CF8", "#4ADE80", "#FACC15", "#FB7185", "#60A5FA"];

  if (!data?.length) return null;

  const topItem = data.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    data[0]
  );

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius="48%"
          outerRadius="75%"
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={1}
            />
          ))}
          <LabelList dataKey={"value"} position={"outside"} />
        </Pie>

        <text
          x="50%"
          y="39%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fill="#6B7280"
        >
          {centerLabel}
        </text>

        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={16}
          fontWeight={600}
          fill="#111827"
        >
          {topItem.name}
        </text>

        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#374151"
        >
          {topItem.value.toLocaleString()}
        </text>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

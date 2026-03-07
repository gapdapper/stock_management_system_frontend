import type { IChartData } from "@/types/dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Prop = {
  data: IChartData[];
};

export default function BarChartSection({ data }: Prop) {
  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />

          <XAxis
            type="number"
            label={{
              value: "Sold Amount",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis type="category" dataKey="name" width={110} />

          <Tooltip />

          <Bar dataKey="value" fill="#82ca9d" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

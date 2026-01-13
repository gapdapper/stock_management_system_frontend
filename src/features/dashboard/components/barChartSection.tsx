import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function BarChartSection() {
  const data = [
    {
      name: "Chess",
      sold: 531,
    },
    {
      name: "Jenga",
      sold: 499,
    },
    {
      name: "Domino",
      sold: 452,
    },
    {
      name: "Jackpot",
      sold: 421,
    },
    {
      name: "Dice Roller",
      sold: 377,
    },
  ];
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

        <YAxis
          type="category"
          dataKey="name"
          width={110}
        />

        <Tooltip />

        <Bar dataKey="sold" fill="#82ca9d" radius={[0, 6, 6, 0]}>
          <LabelList
            dataKey="sold"
            position="right"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </>
  );
}

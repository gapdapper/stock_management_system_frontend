type IChartData = {
  name: string;
  value: number;
};

export const normalizeDonutData = <T,>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T
): IChartData[] => {
  return data.map(item => ({
    name: String(item[labelKey]),
    value: Number(item[valueKey]),
  }));
};
type DonutData = {
  name: string;
  value: number;
};

export const normalizeDonutData = <T,>(
  data: T[],
  labelKey: keyof T,
  valueKey: keyof T
): DonutData[] => {
  return data.map(item => ({
    name: String(item[labelKey]),
    value: Number(item[valueKey]),
  }));
};
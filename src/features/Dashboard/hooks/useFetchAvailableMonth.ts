import { useEffect, useMemo, useState } from "react";
import { getAvailableMonths } from "../api/DashboardService";
import { showToast } from "@/components/Toast";
import type { IMonthOption } from "@/types/dashboard";

function useFetchAvailableMonth() {
  const [availableMonth, setAvailableMonth] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoadingMonths, setIsLoadingMonths] = useState<boolean>(true);

  const fetchAvailableMonthsData = async () => {
    try {
      const availableMonthData = await getAvailableMonths();
      setAvailableMonth(availableMonthData);
    } catch (error) {
      showToast("Unable to load sales data. Please try again later.", "error");
    } finally {
      setIsLoadingMonths(false);
    }
  };

  useEffect(() => {
    fetchAvailableMonthsData();
  }, []);

  const formattedMonth: IMonthOption[] = useMemo(() => {
    let isIncludedCurrentMonth = false;
    const today = new Date();
    let formatted = availableMonth.map((monthStr) => {
      const [year, month] = monthStr.split("-").map((val) => Number(val));
      const newDate = new Date(year, month - 1);
      if (year == today.getFullYear() && month == today.getMonth() + 1) {
        isIncludedCurrentMonth = true;
      }
      return {
        val: monthStr,
        display: `${newDate.toLocaleString("default", { month: "long" })} - ${newDate.getFullYear()}`,
      };
    });

    if (!isIncludedCurrentMonth) {
      formatted.push({
        val: `${today.getFullYear()}-${today.getMonth() + 1}`,
        display: `${today.toLocaleString("default", { month: "long" })} - ${today.getFullYear()}`,
      });
    }

    return formatted.sort((a, b) => {
      const dateA = new Date(a.val + "-01");
      const dateB = new Date(b.val + "-01");
      return dateB.getTime() - dateA.getTime();
    });
  }, [availableMonth]);

  useEffect(() => {
    if (!formattedMonth.length) return;
    setSelectedMonth(formattedMonth[0].val);
  }, [formattedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return { selectedMonth, isLoadingMonths, formattedMonth, handleMonthChange };
}

export default useFetchAvailableMonth;

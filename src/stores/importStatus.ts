import { create } from "zustand";
import { getUploadLog } from "@/features/importFile-temp/api/ImportService";

type ImportStatusState = {
  hasImportedToday: boolean;
  lastImportAt: string | null;
  fetchImportStatus: () => Promise<void>;
};

export const useImportStatusStore = create<ImportStatusState>((set) => ({
  hasImportedToday: false,
  lastImportAt: null,

  fetchImportStatus: async () => {
    try {
      const log = await getUploadLog();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastImportedDate = new Date(log.uploadAt);
      lastImportedDate.setHours(0, 0, 0, 0);

      set({
        hasImportedToday:
          lastImportedDate.getTime() === today.getTime(),
        lastImportAt: log.uploadAt,
      });
    } catch (error) {
      console.error("Failed to fetch import status", error);
      set({ hasImportedToday: false, lastImportAt: null });
    }
  },
}));


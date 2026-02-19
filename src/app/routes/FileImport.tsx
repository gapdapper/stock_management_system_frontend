import Toast, { showToast } from "@/components/toast";
import { importFile } from "@/features/importFile/api/importFile";
import Headers from "@/features/importFile/components/Headers";
import ImportSection from "@/features/importFile/components/ImportSection";
import { useImportStatusStore } from "@/stores/importStatus";

export default function FileImport() {
  const ALLOWED_EXTENSIONS = ["csv", "xlsx"];
  const MAX_FILE_SIZE_MB = 5;
  const fetchImportStatus = useImportStatusStore((s) => s.fetchImportStatus);

  const handleFilesSelected = async (files: File[]) => {
    const invalidFiles = files.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isValidExt = ext && ALLOWED_EXTENSIONS.includes(ext);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      return !isValidExt || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      showToast("Only CSV/XLSX files under 5MB are allowed", "error");
      return;
    }
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      await importFile(formData);
      await fetchImportStatus();
      showToast("Import completed", "success");
    } catch (error) {
      showToast("Import failed", "error");
    }
  };
  return (
    <>
      <Headers />
      <ImportSection onFilesSelected={handleFilesSelected} />
      <Toast />
    </>
  );
}

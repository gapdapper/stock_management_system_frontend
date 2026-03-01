import Toast, { showToast } from "@/components/Toast";
import { importFile } from "@/features/importFile/api/importFile";
import ImportSection from "@/features/importFile/components/ImportSection";
import { useImportStatusStore } from "@/stores/importStatus";

export default function FileImport() {
  const ALLOWED_EXTENSIONS = ["csv", "xlsx"];
  const MAX_FILE_SIZE_MB = 5;
  const updateImportStatus = useImportStatusStore((s) => s.fetchImportStatus);

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
      await updateImportStatus();
      showToast("Import completed", "success");
    } catch (error) {
      showToast("Import failed", "error");
    }
  };
  return (
    <>
      <div className="mb-4">
        <h1 className="mb-1">Import Sales Data</h1>
        <p className="text-muted mb-0">
          Import exported sales data from e-commerce platforms into the system
        </p>
      </div>
      <ImportSection onFilesSelected={handleFilesSelected} />
      <Toast />
    </>
  );
}

import Toast, { showToast } from "@/components/oast";
import { importFile } from "@/features/importFile/api/ImportService";
import { useImportStatusStore } from "@/stores/importStatus";
import "@/features/importFile/components/FileImport.scss"

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    handleFilesSelected(files);
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="mb-1">Import Sales Data</h1>
        <p className="text-muted mb-0">
          Import exported sales data from e-commerce platforms into the system
        </p>
      </div>
      <div className="import-container">
        <label htmlFor="file-input" className="drop-zone">
          <div className="drop-content">
            <div className="icon">📄</div>

            <h6 className="mb-1">Import sales data</h6>

            <p className="text-muted small mb-2">
              Drag & drop your exported sales file here (CSV/XLXS)
            </p>

            <span className="hint">or click to browse file</span>
          </div>
          <input
            id="file-input"
            type="file"
            hidden
            multiple
            accept=".csv,.xlsx"
            onChange={handleChange}
          />
        </label>
      </div>
      <Toast />
    </>
  );
}

import Toast, { showToast } from "@/components/Toast";
import { importFile } from "@/features/importFile/api/ImportService";
import { useImportStatusStore } from "@/stores/importStatus";
import "@/features/importFile/components/FileImport.scss";
import SuccessModal from "@/components/SuccessModal";
import { useState } from "react";
import type { IImportSummary } from "@/types/transaction";

export default function FileImport() {
  const ALLOWED_EXTENSIONS = ["csv", "xlsx"];
  const MAX_FILE_SIZE_MB = 5;
  const updateImportStatus = useImportStatusStore((s) => s.fetchImportStatus);
  const [importSummary, setImportSummary] = useState<IImportSummary[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

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

      const result = await importFile(formData);
      setImportSummary(result ?? []);
      await updateImportStatus();
      setShowSuccess(true);
    } catch (error) {
      showToast("Import failed", "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    handleFilesSelected(files);
    e.target.value = "";
  };

  return (
    <div className="file-import-container">
      <div className="file-import-header">
        <h4>File Import</h4>
      </div>
      <div className="import-container">
        <h5 className="sub-header">Import Sales Data</h5>
        <p className="text-muted mb-0 sub-header-description">
          Import exported sales data from e-commerce platforms into the system
        </p>
        <label htmlFor="file-input" className="drop-zone">
          <div className="drop-content">
            <div className="icon">📄</div>

            <h6 className="mb-1">Import sales data</h6>

            <p className="text-muted small mb-0">
              Drag & drop your exported sales file here
            </p>
            <p className="text-muted small mb-2">
              Supports CSV/XLSX from Lazada, Shopee, TikTok Shop
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
      {showSuccess && (
        <SuccessModal
          title="Import Successfully!"
          primaryAction={() => {
            setShowSuccess(false);
            setImportSummary([]);
          }}
          primaryActionName="Back to File Import"
        >
          <div className="import-summary fade-in">
            <p className="summary-title">Import Summary</p>
            <div className="transaction-summary-content">
              {importSummary &&
                importSummary.length != 0 &&
                importSummary.map((item, i) => (
                  <div className="transaction-summary-item" key={i}>
                    <span className="transaction-id">
                      {item.orderId} - {item.buyer}
                    </span>
                    <span className="status"> {item.status}</span>
                  </div>
                ))}
              {importSummary.length === 0 && (
                <div className="empty-transaction">
                  No new transactions detected
                </div>
              )}
            </div>
            {importSummary && importSummary.length != 0 && (
              <p className="summary-footer">
                {importSummary.length} Transactions Imported From{" "}
                {importSummary.every((val) => val.platformId === 1)
                  ? "Shopee"
                  : importSummary.every((val) => val.platformId === 2)
                    ? "Lazada"
                    : "TikTok Shop"}
              </p>
            )}
          </div>
        </SuccessModal>
      )}
    </div>
  );
}

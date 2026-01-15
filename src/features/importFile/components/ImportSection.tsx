import "./ImportSection.scss";

type Props = {
  onFilesSelected: (files: File[]) => void;
};

export default function ImportSection({ onFilesSelected }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    onFilesSelected(files);
  };
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <label htmlFor="file-input" className="drop-zone">
          <div className="drop-content">
            <div className="icon">📄</div>

            <h6 className="mb-1">Import sales report</h6>

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
    </div>
  );
}

import Toast, { showToast } from "@/components/toast";
import { importFile } from "@/features/importFile/api/importFile";
import Headers from "@/features/importFile/components/Headers";
import ImportSection from "@/features/importFile/components/ImportSection";

export default function FileImport() {
  const handleFilesSelected = async (files: File[]) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      await importFile(formData);
      showToast("Import completed", "success");
    } catch (error) {
      showToast("Invalid file format", "error");
      throw new Error();
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

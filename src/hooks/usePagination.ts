import { useEffect, useMemo, useState, type RefObject } from "react";

function usePagination(
  rawData: any[],
  headerRef: RefObject<HTMLDivElement | null>,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(rawData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return rawData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [rawData, currentPage]);

  const scrollToHeader = () => {
    const header = headerRef.current;
    const container = document.querySelector("main");

    if (header && container) {
      container.scrollTo({
        top: header.offsetTop - 24,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [rawData]);

  useEffect(() => {
    scrollToHeader();
  }, [currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return { paginatedData, totalPages, currentPage, goToPage };
}

export default usePagination;

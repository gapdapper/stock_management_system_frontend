import LoadingSpinner from "@/components/loadingSpinner";
import Headers from "@/features/salesRecord/components/Headers";
import Table from "@/features/salesRecord/components/Table";
import { useEffect, useState } from "react";
import type { IFilter, ITransactions } from "../types/transaction";
import { getTransactions } from "@/features/salesRecord/api/getTransactions";

export default function SalesRecord() {
  const [rawData, setRawData] = useState<ITransactions[]>([]);
  const [filterData, setFilterData] = useState<ITransactions[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    platform: "all",
    status: "all",
    period: "all",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filterData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const fetchTransactionsData = async () => {
    try {
      const data = await getTransactions();
      setRawData(data);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    let result = [...rawData];

    // Status filter
    if (filter.status !== "all") {
      result = result.filter((item) => item.status === filter.status);
    }

    // Platform filter
    if (filter.platform !== "all") {
      result = result.filter((item) => item.platform === filter.platform);
    }

    // Date range filter
    if (filter.period !== "all") {
      const now = new Date();

      result = result.filter((item) => {
        const createdAt = new Date(item.createdAt);

        switch (filter.period) {
          case "today":
            return createdAt.toDateString() === now.toDateString();

          case "last-7-days":
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return createdAt >= sevenDaysAgo;

          case "this-month":
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );

          default:
            return true;
        }
      });
    }
    setFilterData(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
  }, [rawData, filter]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <Headers filterSetter={setFilter} />
        <Table data={paginatedData} />
        <div className="pagination-minimal d-flex justify-content-start align-items-center gap-2 mt-4 mb-4">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                className={`btn btn-sm ${
                  isActive ? "btn-dark" : "btn-outline-secondary"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      </>
    );
  }
}

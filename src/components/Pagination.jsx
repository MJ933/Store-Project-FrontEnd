import { useState, useEffect } from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  // Determine max visible pages based on screen width
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 300) {
        setMaxVisiblePages(3);
      } else {
        setMaxVisiblePages(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(currentPage - halfVisible, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-center gap-1.5 m-2 max-[300px]:m-1">
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 max-[300px]:p-1 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5 max-[300px]:w-4 max-[300px]:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`px-3.5 py-2 max-[300px]:px-2 max-[300px]:py-1 rounded-md ${
                1 === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              } transition-colors duration-200 border border-gray-200 text-sm max-[300px]:text-[10px]`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 max-[300px]:px-1 text-gray-400 text-sm max-[300px]:text-[10px]">
                ...
              </span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3.5 py-2 max-[300px]:px-2 max-[300px]:py-1 rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200 border border-gray-200 text-sm max-[300px]:text-[10px]`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 max-[300px]:px-1 text-gray-400 text-sm max-[300px]:text-[10px]">
                ...
              </span>
            )}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3.5 py-2 max-[300px]:px-2 max-[300px]:py-1 rounded-md ${
                totalPages === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              } transition-colors duration-200 border border-gray-200 text-sm max-[300px]:text-[10px]`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 max-[300px]:p-1 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5 max-[300px]:w-4 max-[300px]:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

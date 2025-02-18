import { useState, useEffect } from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  // Determine max visible pages based on screen width
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 300) {
        setMaxVisiblePages(3); // Show fewer pages on very small screens
      } else {
        setMaxVisiblePages(5); // Default for larger screens
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
    <div
      className="flex items-center justify-center gap-1.5 m-2"
      style={{
        margin: "calc(0.5em + 0.5vw)", // Responsive margin
      }}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          padding: "calc(0.5em + 0.5vw)", // Responsive padding
        }}
        aria-label="Previous page"
      >
        <svg
          className="w-5 h-5"
          style={{
            width: "calc(1em + 0.5vw)", // Responsive SVG size
            height: "calc(1em + 0.5vw)",
          }}
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

      {/* First Page Button */}
      {startPage > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`px-3.5 py-2 rounded-md ${
              1 === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200 border border-gray-200 text-sm`}
            style={{
              fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              padding: "calc(0.3em + 0.3vw)", // Responsive padding
            }}
          >
            1
          </button>
          {startPage > 2 && (
            <span
              className="px-2 text-gray-400 text-sm"
              style={{
                fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              }}
            >
              ...
            </span>
          )}
        </>
      )}

      {/* Page Buttons */}
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3.5 py-2 rounded-md ${
            page === currentPage
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-600 hover:bg-gray-50"
          } transition-colors duration-200 border border-gray-200 text-sm`}
          style={{
            fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
            padding: "calc(0.3em + 0.3vw)", // Responsive padding
          }}
        >
          {page}
        </button>
      ))}

      {/* Last Page Button */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span
              className="px-2 text-gray-400 text-sm"
              style={{
                fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              }}
            >
              ...
            </span>
          )}
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3.5 py-2 rounded-md ${
              totalPages === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            } transition-colors duration-200 border border-gray-200 text-sm`}
            style={{
              fontSize: "calc(0.8em + 0.5vw)", // Responsive font size
              padding: "calc(0.3em + 0.3vw)", // Responsive padding
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          padding: "calc(0.5em + 0.5vw)", // Responsive padding
        }}
        aria-label="Next page"
      >
        <svg
          className="w-5 h-5"
          style={{
            width: "calc(1em + 0.5vw)", // Responsive SVG size
            height: "calc(1em + 0.5vw)",
          }}
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
  );
};

export default Pagination;
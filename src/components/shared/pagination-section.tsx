import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextLast,
  PaginationPrevious,
  PaginationPreviousLast
} from '@/components/ui/pagination';

type TPaginationSectionProps = {
  totalPosts?: number; // optional for server-driven
  postsPerPage?: number; // optional for server-driven
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages?: number; // server-driven
  setPageSize?: (size: number) => void; // server-driven
};

/**
 * Thành phần phân trang hiển thị các trang và điều khiển phân trang.
 */
export default function PaginationSection({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  setPageSize
}: TPaginationSectionProps) {
  // Use totalPages if provided, otherwise calculate from totalPosts/postsPerPage
  const pageCount =
    totalPages ??
    (totalPosts && postsPerPage ? Math.ceil(totalPosts / postsPerPage) : 1);
  const pageNumbers: number[] = [];
  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }

  // Số trang hiển thị tối đa tại một thời điểm
  const maxPageNum = 2;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePrevPageLast = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const handleNextPageLast = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(pageNumbers.length);
    }
  };

  // Hàm render số trang và hiển thị dấu "..."
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={currentPage === page ? 'rounded-md bg-primary' : ''}
      >
        <PaginationLink
          isActive={currentPage === page}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Nếu trang đầu tiên của activePages > 1 thì thêm dấu "..."
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />
      );
    }

    // Nếu trang cuối của activePages < tổng số trang thì thêm dấu "..."
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />
      );
    }

    return renderedPages;
  };

  // Optional: Page size selector for server-driven pagination
  const pageSizeOptions = [5, 10, 12, 20, 50];

  return (
    <div className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPreviousLast onClick={handlePrevPageLast} />
            <PaginationPrevious onClick={handlePrevPage} />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
            <PaginationNextLast onClick={handleNextPageLast} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {setPageSize && (
        <div className="mt-2 flex items-center gap-2 md:mt-0">
          <span className="text-sm">Số mục/trang:</span>
          <select
            className="rounded border px-2 py-1 text-sm"
            onChange={(e) => setPageSize(Number(e.target.value))}
            defaultValue={postsPerPage || 12}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

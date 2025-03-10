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
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

/**
 * Thành phần phân trang hiển thị các trang và điều khiển phân trang.
 */
export default function PaginationSection({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage
}: TPaginationSectionProps) {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
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

  return (
    <div className="p-4">
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
    </div>
  );
}

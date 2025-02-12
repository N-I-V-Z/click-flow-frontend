import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect, useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
// import StudentCreateForm from '@/pages/students/components/student-forms/student-create-form';
import { Input } from '../ui/input';
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  pageCount: number;
  showAdd?: boolean;
  heightTable?: string;
}

/**
 * `DataTable` là một thành phần React dùng để hiển thị dữ liệu dưới dạng bảng với các tính năng như tìm kiếm, phân trang, và sắp xếp.
 *
 * @template TData - Kiểu dữ liệu của các hàng trong bảng.
 * @template TValue - Kiểu dữ liệu của các giá trị trong bảng.
 *
 * @param columns - Định nghĩa các cột của bảng.
 * @param data - Dữ liệu để hiển thị trong bảng.
 * @param pageCount - Tổng số trang dữ liệu.
 * @param pageSizeOptions - Các tùy chọn kích thước trang. [10, 20, 30, 40, 50]
 * @param showAdd - Hiển thị nút thêm mới nếu là `true`. Mặc định là true
 * @param heightTable - Chiều cao của bảng. Mặc định 80dvh
 *
 * @returns Thành phần React hiển thị bảng dữ liệu.
 *
 * @description
 * Thành phần này sử dụng `useReactTable` từ thư viện `@tanstack/react-table` để quản lý trạng thái bảng, bao gồm phân trang, sắp xếp và lọc dữ liệu.
 *
 * - Tìm kiếm: Người dùng có thể nhập từ khóa vào ô tìm kiếm để lọc dữ liệu hiển thị.
 * - Phân trang: Người dùng có thể điều hướng giữa các trang dữ liệu bằng các nút điều khiển.
 * - Sắp xếp: Người dùng có thể sắp xếp dữ liệu theo cột bằng cách nhấp vào tiêu đề cột.
 *
 * Thành phần này cũng sử dụng `useSearchParams` từ `react-router-dom` để đồng bộ hóa trạng thái phân trang với URL.
 */
export default function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showAdd = true,
  heightTable = '80dvh'
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  // Search params
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    // Update the URL with the new page number and limit
    setSearchParams({
      ...Object.fromEntries(searchParams), // Spread the existing search params
      page: (pageIndex + 1).toString(), // Update the page number (assuming pageIndex is 0-based)
      limit: pageSize.toString() // Update the limit
    });
  }, [pageIndex, pageSize, searchParams, setSearchParams]);

  const filteredData = useMemo(() => {
    return data?.filter((item: any) => {
      return Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting
  });

  return (
    <>
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex flex-1 gap-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 rounded-md border px-4 py-2"
          />
        </div>
        {/* <div className="flex gap-3">
          {showAdd && (
            <PopupModal
              renderModal={(onClose) => (
                <StudentCreateForm modalClose={onClose} />
              )}
            />
          )}
        </div> */}
      </div>
      <ScrollArea
        className={`h-[calc(${heightTable}-220px)] rounded-md border md:h-[calc(${heightTable}-80px)]`}
      >
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽'
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} trên{' '}
            {table.getFilteredRowModel().rows.length} hàng được chọn.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">Hiển thị</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: string) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[150px] items-center justify-center text-sm font-medium">
            Trang {table.getState().pagination.pageIndex + 1} trên{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

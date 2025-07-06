import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
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
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Column
} from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../ui/input';
import { DataTableSkeleton } from './data-table-skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  pageCount: number;
  heightTable?: string;
  // Search callback for parent component
  onSearchChange?: (searchTerm: string) => void;
  // Loading state
  isLoading?: boolean;
}

/**
 * DataTable với server-side pagination và search
 */
export default function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
  heightTable = '80dvh',
  onSearchChange,
  isLoading = false
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy tham số phân trang từ URL
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // State phân trang (pageIndex là 0-based)
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  // Cập nhật URL khi phân trang thay đổi
  useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: (pageIndex + 1).toString(),
      limit: pageSize.toString()
    });
  }, [pageIndex, pageSize, searchParams, setSearchParams]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchTerm);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  const table = useReactTable({
    data: data || [], // Sử dụng data trực tiếp từ props (đã được filter ở backend)
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Quan trọng: sử dụng server-side pagination
    manualFiltering: true, // Quan trọng: sử dụng server-side filtering
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting
  });

  // Helper function để render sort icon
  const renderSortIcon = (column: Column<TData, unknown>) => {
    if (!column.getCanSort()) return null;

    const sorted = column.getIsSorted();

    if (sorted === 'asc') {
      return <ChevronUpIcon className="ml-2 h-4 w-4" />;
    }

    if (sorted === 'desc') {
      return <ChevronDownIcon className="ml-2 h-4 w-4" />;
    }

    return <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />;
  };

  if (isLoading) return <DataTableSkeleton columnCount={5} rowCount={10} />;

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
      </div>

      <ScrollArea
        className={`h-[calc(${heightTable}-220px)] rounded-md border md:h-[calc(${heightTable}-80px)]`}
      >
        <Table className="relative w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                        ? 'cursor-pointer select-none transition-colors hover:bg-muted/50'
                        : ''
                    }
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {renderSortIcon(header.column)}
                    </div>
                  </TableHead>
                ))}
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

      <div className="mb-10 flex flex-col items-center justify-end gap-2 space-x-2 py-6 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} trên{' '}
            {table.getRowModel().rows.length} hàng được chọn. */}
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

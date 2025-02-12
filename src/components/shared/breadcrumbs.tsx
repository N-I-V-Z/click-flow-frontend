import { Slash } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';

export type BreadcrumbItemProps = {
  title: string;
  link: string;
};

/**
 * `Breadcrumbs` là một component hiển thị đường dẫn điều hướng (breadcrumb) cho ứng dụng.
 *
 * @param items - Một mảng các đối tượng chứa thông tin về từng mục trong breadcrumb.
 *
 * @returns Một phần tử JSX hiển thị breadcrumb.
 *
 * Component này sử dụng các thành phần nội bộ như `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`,
 * `BreadcrumbSeparator`, và `BreadcrumbPage` để xây dựng cấu trúc breadcrumb.
 *
 * - `BreadcrumbItem` và `BreadcrumbLink` được sử dụng cho các mục không phải là mục cuối cùng trong breadcrumb.
 * - `BreadcrumbSeparator` được sử dụng để hiển thị dấu phân cách giữa các mục.
 * - `BreadcrumbPage` được sử dụng cho mục cuối cùng, đại diện cho trang hiện tại.
 *
 * Mỗi mục trong `items` phải có thuộc tính `title` và `link`. `title` được sử dụng để hiển thị văn bản của mục,
 * trong khi `link` được sử dụng cho thuộc tính `href` của `BreadcrumbLink`.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

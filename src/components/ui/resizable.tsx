import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

/**
 * `ResizablePanelGroup` là một component dùng để tạo nhóm các panel có thể thay đổi kích thước.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho nhóm panel.
 * @param props - Các thuộc tính khác được truyền vào từ `ResizablePrimitive.PanelGroup`.
 *
 * @description
 * Component này sử dụng thư viện `react-resizable-panels` để quản lý các panel có thể thay đổi kích thước.
 * Nó cũng sử dụng hàm `cn` để kết hợp các lớp CSS, cho phép tùy chỉnh giao diện của nhóm panel.
 *
 * Các panel trong nhóm có thể được sắp xếp theo chiều ngang hoặc dọc, tùy thuộc vào thuộc tính `panel-group-direction`.
 */
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className
    )}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

/**
 * `ResizableHandle` là một component dùng để tạo tay cầm cho các panel có thể thay đổi kích thước.
 *
 * @param withHandle - Tùy chọn để hiển thị tay cầm kéo.
 * @param className - Tên lớp CSS bổ sung để tùy chỉnh kiểu dáng.
 * @param props - Các thuộc tính khác được truyền vào `ResizablePrimitive.PanelResizeHandle`.
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

// Inspired by react-hot-toast library
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST'
} as const;

let count = 0;

/**
 * Hàm này tạo ra một ID duy nhất bằng cách tăng biến `count` lên 1 và đảm bảo rằng giá trị của `count` không vượt quá giới hạn an toàn của số nguyên trong JavaScript. Sau đó, hàm trả về giá trị `count` dưới dạng chuỗi.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Thêm một toast vào hàng đợi để xóa sau một khoảng thời gian nhất định.
 *
 * @param toastId - ID của toast cần thêm vào hàng đợi xóa
 *
 * @description
 * Hàm này kiểm tra xem `toastId` đã có trong `toastTimeouts` chưa.
 * Nếu chưa, nó sẽ tạo một `setTimeout` để xóa `toastId` khỏi `toastTimeouts` và gửi một hành động `REMOVE_TOAST` sau khi `TOAST_REMOVE_DELAY` kết thúc.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Hàm `reducer` xử lý các hành động liên quan đến quản lý trạng thái của các thông báo (toasts).
 *
 * @param state - Trạng thái hiện tại của các thông báo.
 * @param action - Hành động cần thực hiện trên trạng thái.
 *
 * @description
 * Các hành động có thể bao gồm:
 * - 'ADD_TOAST': Thêm một thông báo mới vào danh sách, giới hạn số lượng thông báo tối đa bởi `TOAST_LIMIT`.
 * - 'UPDATE_TOAST': Cập nhật thông báo hiện có dựa trên `id` của thông báo.
 * - 'DISMISS_TOAST': Đánh dấu thông báo là đã đóng (open: false) và thêm vào hàng đợi để xóa sau một khoảng thời gian.
 * - 'REMOVE_TOAST': Xóa thông báo khỏi danh sách dựa trên `id`. Nếu `toastId` không được cung cấp, xóa tất cả thông báo.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false
              }
            : t
        )
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

/**
 * Hàm `dispatch` thực hiện việc cập nhật trạng thái `memoryState` dựa trên hành động được truyền vào.
 * Sau khi trạng thái được cập nhật, hàm sẽ gọi tất cả các hàm lắng nghe trong danh sách `listeners` với trạng thái mới nhất.
 *
 * @param action - Hành động cần thực hiện để cập nhật trạng thái, có thể là thêm, cập nhật, hủy hoặc xóa một thông báo (toast).
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

/**
 * Hàm `toast` tạo một thông báo mới với các thuộc tính được cung cấp.
 *
 * @param props - Các thuộc tính của thông báo, ngoại trừ ID.
 *
 * @description
 * - Tạo một ID duy nhất cho thông báo bằng cách sử dụng hàm `genId`.
 * - Gửi hành động `ADD_TOAST` để thêm thông báo mới vào trạng thái.
 * - Cung cấp các phương thức `update` và `dismiss` để cập nhật hoặc loại bỏ thông báo.
 * - Khi thông báo đóng, tự động gọi phương thức `dismiss`.
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id }
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });

  return {
    id: id,
    dismiss,
    update
  };
}

/**
 * Hook `useToast` cung cấp khả năng quản lý và hiển thị thông báo toast trong ứng dụng.
 *
 * @description
 * - Sử dụng `useState` để theo dõi trạng thái hiện tại của các toast.
 * - `useEffect` được sử dụng để thêm và loại bỏ hàm `setState` vào danh sách `listeners` khi component được mount và unmount.
 * - Trả về đối tượng chứa trạng thái hiện tại của các toast, hàm `toast` để thêm toast mới, và hàm `dismiss` để loại bỏ toast dựa trên `toastId`.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId })
  };
}

export { useToast, toast };

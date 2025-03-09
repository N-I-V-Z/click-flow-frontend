import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RegisterChoiceModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-auto max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <DialogHeader>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Bắt đầu hành trình của bạn ngay hôm nay!
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {/* PUBLISHER */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-gradient-to-b from-purple-100 to-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-purple-600">PUBLISHER</h3>
              <h4 className="text-lg font-semibold text-gray-700">
                KIẾM TIỀN ONLINE
              </h4>
              <p className="mt-3 text-center text-sm text-gray-600">
                Trở thành Publisher và kiếm tiền online với mỗi nhiệm vụ thành
                công.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✅ Nhận hoa hồng khi hoàn thành nhiệm vụ.</li>
                <li>✅ Cơ hội hợp tác với nhiều thương hiệu.</li>
              </ul>
              <Link to="register-publisher" onClick={onClose}>
                <Button className="mt-6 w-full flex-1 rounded-lg bg-purple-500 px-6 py-1 text-lg font-semibold text-white transition-all hover:scale-105 hover:bg-purple-600">
                  Đăng ký ngay
                </Button>
              </Link>
            </motion.div>

            {/* ADVERTISER */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center rounded-xl border border-gray-200 bg-gradient-to-b from-purple-100 to-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-purple-600">ADVERTISER</h3>
              <h4 className="text-lg font-semibold text-gray-700">
                TƯ VẤN DOANH NGHIỆP
              </h4>
              <p className="mt-3 text-center text-sm text-gray-600">
                Giải pháp marketing tối ưu dành cho doanh nghiệp muốn tăng
                trưởng.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✅ Tiếp cận khách hàng tiềm năng.</li>
                <li>✅ Công cụ đo lường hiệu quả chính xác.</li>
              </ul>
              <Link to="register-advertiser">
                <Button
                  className="hover:bg-blue-600 mt-6 w-full flex-1 rounded-lg bg-purple-500 px-6 py-1 text-lg font-semibold text-white transition-all hover:scale-105"
                  onClick={onClose} // Đóng modal khi nhấn
                >
                  Nhận tư vấn
                </Button>
              </Link>
            </motion.div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

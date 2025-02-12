import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { Input } from '../ui/input';

/**
 * Thành phần Footer hiển thị thông tin liên hệ, menu điều hướng và form đăng ký nhận tin.
 */
export default function Footer() {
  return (
    <footer className="mt-[5%] h-[40dvh] w-full   py-8 2xl:h-[30dvh]">
      <div className="">
        <div className="grid grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <p className="mt-4">
              <ul className="flex flex-col gap-2">
                <li className="flex">
                  <Icons.mapPin className="mr-2 size-5" /> Địa chỉ: 1234 Street
                  Name, City Name
                </li>
                <li className="flex">
                  <Icons.phone className="mr-2 size-5" /> Số điện thoại: 0123456789
                </li>
                <li className="flex">
                  <Icons.mail className="mr-2 size-5" /> Email:
                  example@gmail.com
                </li>
              </ul>
            </p>
          </div>
          <div>
            <h3 className="flex gap-4 text-lg font-semibold">Menu</h3>
            <div className="mt-2 flex flex-col gap-2">
              <a href="/" className="block">
                Trang chủ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

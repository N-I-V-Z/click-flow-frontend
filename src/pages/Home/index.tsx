import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';

export default function HomePage() {
  return (
    <div className="bg-white">
      <BasePages
        className="relative mx-auto w-[90%] flex-1 overflow-y-auto bg-white p-4"
        pageHead="Trang chủ"
      >
        <Footer />
      </BasePages>
    </div>
  );
}

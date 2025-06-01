import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import Partner from '@/pages/Home/Partner';
import Background from '@/pages/Home/Background';
import RegisterChoiceHome from './RegisterChoiceHome';
import Model from './Model';
export default function HomePage() {
  return (
    <BasePages
      className="relative mx-auto w-full flex-1 overflow-y-auto"
      pageHead="ClickFlow - Trang chủ"
    >
      {/* Background Section */}
      <Background />
      {/* Register Choice */}
      <RegisterChoiceHome />
      {/* Model */}
      <Model />
      {/* Partner */}
      <Partner />
      <Footer />
    </BasePages>
  );
}

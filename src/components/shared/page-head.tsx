import { Helmet } from 'react-helmet-async';

/**
 * Thành phần `PageHead` để thiết lập tiêu đề trang.
 *
 * @param title Tiêu đề của trang, mặc định là 'Website'
 */
export default function PageHead({ title = 'Website' }) {
  return (
    <Helmet>
      <title> {title} </title>
    </Helmet>
  );
}

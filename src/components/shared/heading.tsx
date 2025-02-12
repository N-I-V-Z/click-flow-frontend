type THeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

/**
 * Tạo một thành phần tiêu đề với tiêu đề và mô tả.
 *
 * @param title Tiêu đề chính của thành phần.
 * @param description Mô tả ngắn gọn cho tiêu đề.
 * @param className Lớp CSS tùy chỉnh cho thành phần.
 */
export default function Heading({
  title,
  description,
  className
}: THeadingProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

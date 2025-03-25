// src/types/pdfmake-esm.d.ts

declare module 'pdfmake-esm/pdfmake' {
  // Tối thiểu bạn cần export default 1 giá trị (vì đang import pdfMake from 'pdfmake-esm/pdfmake')
  // Ở đây ta chỉ mô phỏng interface, tuỳ ý bạn bổ sung thêm.

  interface TCreatedPdf {
    download: (arg?: string) => void;
    open: () => void;
    print: () => void;
  }

  interface TDocumentDefinitions {
    content: any;
    styles?: Record<string, any>;
    defaultStyle?: Record<string, any>;
    [key: string]: any;
  }

  interface PdfMake {
    createPdf(docDefinition: TDocumentDefinitions): TCreatedPdf;
    vfs: any;
  }

  const pdfMake: PdfMake;
  export default pdfMake;
}

declare module 'pdfmake-esm/vfs_fonts' {
  // pdfFonts thường là object chứa font, vfs
  const pdfFonts: any;
  export default pdfFonts;
}

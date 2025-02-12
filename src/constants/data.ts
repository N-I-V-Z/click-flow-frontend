import { NavItem } from '@/types';
import {
  PenToolIcon,
  TypeIcon,
  ImageIcon,
  RectangleVerticalIcon,
  LayersIcon,
  SettingsIcon
} from '@/constants/SVGIcon';
import ImgCanva1 from '@/assets/canvas/canvas1.webp';
import ImgCanva2 from '@/assets/canvas/canvas2.webp';
export const navItems: NavItem[] = [
  {
    title: 'Trang chủ',
    subTitle: '',
    href: '/',
    icon: 'shoes',
    label: 'shoes',
    color: 'yellow'
  },
];

export const subNavItems: NavItem[] = [];

export const listMenuCustomize = [
  {
    id: 1,
    icon: PenToolIcon,
    title: 'Công cụ'
  },
  {
    id: 2,
    icon: TypeIcon,
    title: 'Văn bản'
  },
  {
    id: 3,
    icon: ImageIcon,
    title: 'Image Tool'
  },
  {
    id: 4,
    icon: RectangleVerticalIcon,
    title: 'Color Picker'
  },
  {
    id: 5,
    icon: LayersIcon,
    title: 'Layers'
  },
  {
    id: 6,
    icon: SettingsIcon,
    title: 'Settings'
  }
];


export const PagingModel = {
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
  orderBy: '',
  orderDirection: '',
  totalRecord: 0,
  day: 0,
  week: 0,
  month: 0,
  year: 0,
  createdBy: ''
};
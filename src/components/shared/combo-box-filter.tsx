import * as React from 'react';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  useGetProvince,
  useGetDistrict,
  useGetWard
} from '@/queries/location.query';

interface Option {
  value: string;
  label: string;
}

interface FilterValues {
  province: string;
  district: string;
  ward: string;
}

interface FrameworkPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  options: Option[];
}

/**
 * Component FrameworkPopover
 *
 * - Hiển thị một popover chứa danh sách các tùy chọn để người dùng lựa chọn.
 * - Khi người dùng chọn một tùy chọn, giá trị được cập nhật và popover đóng lại.
 *
 * @param open - Trạng thái mở/đóng của popover
 * @param setOpen - Hàm để cập nhật trạng thái mở/đóng của popover
 * @param value - Giá trị hiện tại được chọn
 * @param setValue - Hàm để cập nhật giá trị được chọn
 * @param placeholder - Văn bản hiển thị khi chưa có giá trị nào được chọn
 * @param disabled - Trạng thái vô hiệu hóa của nút chọn
 * @param options - Danh sách các tùy chọn để hiển thị trong popover
 */
const FrameworkPopover: React.FC<FrameworkPopoverProps> = ({
  open,
  setOpen,
  value,
  setValue,
  placeholder,
  disabled,
  options
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy dữ liệu</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    setValue(option.value === value ? '' : option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface ComboBoxFilterProps {
  onFilter: (value: FilterValues) => void;
}

/**
 * `ComboBoxFilter` là một component cho phép người dùng chọn Tỉnh/Thành phố, Quận/Huyện, và Phường/Xã.
 *
 * - Sử dụng các `Popover` để hiển thị danh sách các lựa chọn cho từng cấp địa lý.
 * - Khi người dùng chọn một Tỉnh/Thành phố, component sẽ tự động tải và hiển thị danh sách Quận/Huyện tương ứng.
 * - Khi người dùng chọn một Quận/Huyện, component sẽ tự động tải và hiển thị danh sách Phường/Xã tương ứng.
 * - Khi cả ba cấp địa lý được chọn, hàm `onFilter` sẽ được gọi với thông tin đã chọn.
 *
 * Các trạng thái:
 * - `province`, `district`, `ward`: lưu trữ giá trị đã chọn cho Tỉnh/Thành phố, Quận/Huyện, và Phường/Xã.
 * - `openProvince`, `openDistrict`, `openWard`: điều khiển trạng thái mở của các `Popover`.
 * - `provinceOptions`, `districtOptions`, `wardOptions`: lưu trữ danh sách các lựa chọn cho từng cấp địa lý.
 *
 * Các hiệu ứng:
 * - Tải danh sách Tỉnh/Thành phố khi component được khởi tạo.
 * - Tải danh sách Quận/Huyện khi một Tỉnh/Thành phố được chọn.
 * - Tải danh sách Phường/Xã khi một Quận/Huyện được chọn.
 * - Gọi hàm `onFilter` khi cả ba cấp địa lý được chọn.
 */
const ComboBoxFilter: React.FC<ComboBoxFilterProps> = ({ onFilter }) => {
  // State for selected values
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');

  // State for popover open status
  const [openProvince, setOpenProvince] = useState<boolean>(false);
  const [openDistrict, setOpenDistrict] = useState<boolean>(false);
  const [openWard, setOpenWard] = useState<boolean>(false);

  // State for options
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
  const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
  const [wardOptions, setWardOptions] = useState<Option[]>([]);

  const { data: listProvinces, isLoading: loadingProvinces } = useGetProvince();
  const {
    mutateAsync: getDistrict,
    data: listDistricts,
    isPending: loadingDistricts
  } = useGetDistrict();
  const { mutateAsync: getWard, isPending: loadingWards } = useGetWard();

  useEffect(() => {
    if (listProvinces) {
      const mappedProvinces = listProvinces.map((p: any) => ({
        value: p.name,
        label: p.name
      }));
      setProvinceOptions(mappedProvinces);
    }
  }, [listProvinces]);

  useEffect(() => {
    if (province) {
      const selectedProvince = listProvinces.find(
        (p: any) => p.name === province
      );
      if (selectedProvince) {
        const fetchDistrict = async () => {
          try {
            const res = await getDistrict(selectedProvince.id);
            const mappedDistricts = res.map((d: any) => ({
              value: d.name,
              label: d.name
            }));
            setDistrictOptions(mappedDistricts);
          } catch (error) {
            console.error('Error fetching districts:', error);
            setDistrictOptions([]);
          }
        };
        fetchDistrict();
      }
      setDistrict('');
      setWard('');
      setWardOptions([]);
    } else {
      setDistrictOptions([]);
      setDistrict('');
      setWardOptions([]);
      setWard('');
    }
  }, [province, listProvinces, getDistrict]);

  useEffect(() => {
    if (district) {
      const selectedDistrict = listDistricts?.find(
        (d: any) => d.name === district
      );
      if (selectedDistrict) {
        const fetchWard = async () => {
          try {
            const res = await getWard(selectedDistrict.id);
            const mappedWards = res.map((w: any) => ({
              value: w.name,
              label: w.name
            }));
            setWardOptions(mappedWards);
          } catch (error) {
            console.error('Error fetching wards:', error);
            setWardOptions([]);
          }
        };
        fetchWard();
      }
      // Reset ward selection
      setWard('');
    } else {
      setWardOptions([]);
      setWard('');
    }
  }, [district, listDistricts, getWard]);

  useEffect(() => {
    if (province && district && ward) {
      onFilter({ province, district, ward });
    }
  }, [province, district, ward, onFilter]);

  return (
    <div className="my-4 grid w-full grid-cols-3 gap-3">
      {/* Tỉnh/Thành phố */}
      <div className="flex w-full flex-col space-y-1">
        <FrameworkPopover
          open={openProvince}
          setOpen={setOpenProvince}
          value={province}
          setValue={setProvince}
          placeholder="Tỉnh/Thành phố"
          disabled={loadingProvinces}
          options={provinceOptions}
        />
      </div>
      {/* Quận/Huyện */}
      <div className="flex flex-col space-y-1">
        <FrameworkPopover
          open={openDistrict}
          setOpen={setOpenDistrict}
          value={district}
          setValue={setDistrict}
          placeholder="Quận/Huyện"
          disabled={!province || loadingDistricts}
          options={districtOptions}
        />
      </div>
      {/* Phường/Xã */}
      <div className="flex flex-col space-y-1">
        <FrameworkPopover
          open={openWard}
          setOpen={setOpenWard}
          value={ward}
          setValue={setWard}
          placeholder="Phường/Xã"
          disabled={!district || loadingWards}
          options={wardOptions}
        />
      </div>
    </div>
  );
};

export default ComboBoxFilter;

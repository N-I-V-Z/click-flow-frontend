import * as React from 'react';
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

export interface ComboboxOption {
  label: string;
  value: string;
  searchText?: string; // Additional text for search matching
  customDisplay?: React.ReactNode; // Custom display content
  customTriggerDisplay?: React.ReactNode; // Custom display content for trigger when selected
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No option found.',
  className,
  disabled = false,
  side = 'bottom',
  align = 'start'
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;

    const searchLower = searchValue.toLowerCase();
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(searchLower);
      const searchTextMatch = option.searchText
        ?.toLowerCase()
        .includes(searchLower);
      return labelMatch || searchTextMatch;
    });
  }, [options, searchValue]);

  const handleSelect = (optionValue: string) => {
    if (onValueChange) {
      onValueChange(optionValue === value ? '' : optionValue);
    }
    setOpen(false);
    setSearchValue(''); // Reset search when closing
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSearchValue(''); // Reset search when closing
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-12 w-full justify-between',
            !selectedOption && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedOption
            ? selectedOption.customTriggerDisplay
              ? selectedOption.customTriggerDisplay
              : selectedOption.customDisplay
                ? selectedOption.customDisplay
                : selectedOption.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] max-w-[500px] p-0"
        side={side}
        align={align}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.customDisplay || option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

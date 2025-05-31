import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type SelectOptionProps = {
    className?: React.HTMLAttributes<HTMLDivElement>
    placeholder: string
    label: string
    items: { value: string, label: string }[]
    value: string
    onChange: (value: string) => void
    defaultValue?: string
}

export function SelectOption({
    className,
    items,
    label,
    placeholder,
    value,
    onChange,
    defaultValue
}: SelectOptionProps
) {
    return (
        <Select
            value={value}
            onValueChange={onChange}
            defaultValue={defaultValue}
        >
            <SelectTrigger className={`w-full ${className}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item, index) => (
                        <SelectItem key={item.value + index} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

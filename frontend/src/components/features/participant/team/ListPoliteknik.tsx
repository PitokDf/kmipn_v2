import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { politeknikIndonesia } from "@/lib/politeknikIndonesia"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import React from "react"

export function ListPoliteknik({ onValueChange, value }: { value: string, onValueChange: (value: string) => void }) {
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? value : "Pilih Politeknik..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command className="w-full">
                    <CommandInput placeholder="Search politeknik..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No politeknik found.</CommandEmpty>
                        <CommandGroup>
                            {politeknikIndonesia.map((politeknik, index) => (
                                <CommandItem
                                    key={politeknik + index}
                                    value={politeknik}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {politeknik}
                                    <Check className={cn("ml-auto", value === politeknik ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

    )
}
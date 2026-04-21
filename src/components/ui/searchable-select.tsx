"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
    disabled = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div ref={wrapperRef} className={cn("relative", className)}>
            <div className="relative">
                <input
                    type="text"
                    value={isOpen ? searchQuery : (selectedOption?.label || "")}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setSearchQuery("");
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        !isOpen && !value && "text-muted-foreground"
                    )}
                />
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        value === option.value && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

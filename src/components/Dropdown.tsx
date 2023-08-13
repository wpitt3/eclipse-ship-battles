import React, { useState } from 'react';

interface DropdownProps {
    dropdownId: string;
    className: string;
    label: string;
    options: string[];
    onSelect: (selectedOption: string) => void;
    defaultValue?: string;
}

function Dropdown({ options, onSelect, dropdownId, className, label, defaultValue }: DropdownProps) {
    const [selectedOption, setSelectedOption] = useState<string>(defaultValue || '');

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className={className}>
            <label htmlFor="dropdown">{label}</label>
            <select
                id={dropdownId}
                value={selectedOption}
                onChange={(e) => handleSelectOption(e.target.value)}
            >
                <option value="">-</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
import React from 'react';
import './StatContainer.css';

interface StatContainerProps {
    value: number;
    statName: string;
    labelName: string;
    onChange: (statName: string, value: number) => void;
    min?: number;
    max?: number;
}

export function StatContainer({ value, statName, labelName, onChange, min = 0, max = 10 }: StatContainerProps) {
    return (
        <div className="stat-container">
            <div className="stat-row">
                <h4>{labelName}:</h4>
                {value > min && <button className="minus-button" onClick={() => onChange(statName, - 1)}>-</button>}
                <span className="stat-value">{value}</span>
                {value < max && <button className="plus-button" onClick={() => onChange(statName, 1)}>+</button>}
            </div>
        </div>
    );
}


interface Item {
    name: string,
    props: Record<string, number>,
}

interface ItemUpdaterProps {
    updateItem: (props: Record<string, number>) => void;
    item: Item;
    labelName: (attribute: string) => string;
    min: (attribute: string) => number;
    max: (attribute: string) => number;
    onChange?: () => void;
}

export function ItemUpdater({ updateItem, item, labelName, min, max, onChange = () => {} }: ItemUpdaterProps) {
    const props = item.props;
    const handleStatChange = (statName: string, value: number) => {
        updateItem({...props, [statName]: ({...props}[statName] || 0) + value});
        onChange();
    };
    return (
        <div className="update-form">
            <h2>{item.name}</h2>
            <div className="stat-containers-wrapper">
                {Object.keys({...props}).map((attribute, index) => (
                    <StatContainer
                        key={index}
                        value={{...props}[attribute] || 0}
                        statName={attribute}
                        labelName={labelName(attribute)}
                        onChange={handleStatChange}
                        max={max(attribute)}
                        min={min(attribute)}
                    />
                ))}
            </div>
        </div>
    );
}
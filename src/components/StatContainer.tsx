import React from 'react';
import {toTitle} from "../Formatter";
import './StatContainer.css';

interface StatContainerProps {
    value: number;
    statName: string;
    onChange: (statName: string, value: number) => void;
    min?: number;
    max?: number;
}

export function StatContainer({ value, statName, onChange, min = 0, max = 10 }: StatContainerProps) {
    return (
        <div className="stat-container">
            <div className="stat-row">
                <h4>{toTitle(statName)}:</h4>
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
    min: (attribute: string) => number;
    max: (attribute: string) => number;
}

export function ItemUpdater({ updateItem, item, min, max }: ItemUpdaterProps) {
    const props = item.props;
    const handleStatChange = (statName: string, value: number) => {
        updateItem({...props, [statName]: ({...props}[statName] || 0) + value})
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
                        onChange={handleStatChange}
                        max={max(attribute)}
                        min={min(attribute)}
                    />
                ))}
            </div>
        </div>
    );
}
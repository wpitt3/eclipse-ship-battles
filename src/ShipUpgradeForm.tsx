import React from 'react';
import './ShipUpgradeForm.css';
import {toTitle} from "./Formatter";

interface StatContainerProps {
    value: number;
    statName: string;
    onChange: (statName: string, value: number) => void;
    min?: number;
    max?: number;
}

interface ShipUpgradeFormProps {
    saveShip: (ship: ShipProps) => void;
    initShip: Ship;
}

export interface Ship {
    name: string,
    props: ShipProps,
}

export interface ShipProps {
    initiative: number;
    computers: number;
    shields: number;
    hull: number;
    ion_cannon: number;
    plasma_cannon: number;
    soliton_cannon: number;
    antimatter_cannon: number;
    flux_missile: number;
    plasma_missile: number;
}

function StatContainer({ value, statName, onChange, min = 0, max = 10 }: StatContainerProps) {
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

function ShipUpgradeForm({ saveShip, initShip }: ShipUpgradeFormProps) {
    const ship = initShip.props;
    const handleStatChange = (statName: string, value: number) => {
        saveShip({ ...ship, [statName]: ({...ship}[statName] || 0) + value })
    };
    return (
        <div className="ship-upgrade-form">
            <h2>{initShip.name}</h2>
            <div className="stat-containers-wrapper">
                {Object.keys({...ship}).map((attribute, index) => (
                    <StatContainer
                        key={index}
                        value={{...ship}[attribute] || 0}
                        statName={attribute}
                        onChange={handleStatChange}
                        max={attribute==="shields" ? 0 : 10}
                        min={attribute==="shields" ? -10 : 0}
                    />
                ))}
            </div>
        </div>
    );
}

export default ShipUpgradeForm;

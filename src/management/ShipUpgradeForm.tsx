import React from 'react';
import './ShipUpgradeForm.css';
import {Ship, ShipProps} from "../ShipBuilder";
import {StatContainer} from "../components/StatContainer";

interface ShipUpgradeFormProps {
    saveShip: (ship: ShipProps) => void;
    initShip: Ship;
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

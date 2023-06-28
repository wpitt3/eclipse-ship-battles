import React, { useState } from 'react';
import './ShipUpgradeForm.css';
import ShipUpgradeForm, {Ship, ShipProps} from "./ShipUpgradeForm";

export interface Faction {
    name: string,
    ships: Record<string, Ship>,
}

interface FactionParams {
    saveFaction: (ship: Record<string, Ship>) => void;
    faction: Faction;
}

function FactionForm({saveFaction, faction}: FactionParams) {
    const [newFaction, setFaction] = useState(faction.ships);

    const saveShip = (shipName: string, ship: ShipProps) => {
        setFaction({ ...newFaction, [shipName]: {name: newFaction[shipName]?.name || '', props: ship }});
    };
    return (
        <div>
            <h1>{faction.name}</h1>
            <button onClick={() => saveFaction(newFaction)} >Save</button>
            <div className="faction-upgrade-form">
                {Object.keys(faction.ships).map((shipName, index) => (
                    <ShipUpgradeForm key={index} saveShip={(ship) => saveShip(shipName, ship)} initShip={newFaction[shipName] || newFaction.interceptor} />
                ))}
            </div>
        </div>
    );
}

export default FactionForm;

import React, { useState } from 'react';
import './ShipUpgradeForm.css';
import ShipUpgradeForm from "./ShipUpgradeForm";
import {Ship, ShipProps} from "../ShipBuilder";
import {ItemUpdater} from "../components/StatContainer";

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

    // newFaction[shipName] || newFaction.interceptor

    return (
        <div>
            <h1>{faction.name}</h1>
            <button onClick={() => saveFaction(newFaction)} >Save</button>
            <div className="faction-upgrade-form">
                {Object.keys(faction.ships).map((shipName, index) => (
                    // <ItemUpdater key={index} item={{name: '', props:{x: 1}}} updateItem={(ship) => saveShip(shipName, ship)} max={(x)=> 10} min={(x)=> 10} />
                    <ShipUpgradeForm key={index} saveShip={(ship) => saveShip(shipName, ship)} initShip={newFaction[shipName] || newFaction.interceptor} />
                ))}
            </div>
        </div>
    );
}

export default FactionForm;

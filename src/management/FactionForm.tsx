import React, { useState } from 'react';
import {Ship, ShipProps, shipPropsToDisplayName} from "../ShipBuilder";
import {ItemUpdater} from "../components/StatContainer";
import {toTitle} from "../Formatter";

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

    const saveShip = (shipName: string, props: Record<string, number>) => {
        setFaction({ ...newFaction, [shipName]: {name: newFaction[shipName]?.name || '', props: props as unknown as ShipProps }});
    };

    return (
        <div className="faction-upgrade">
            <div className="faction-upgrade-title">
                <h1>{faction.name}</h1>
                <button onClick={() => saveFaction(newFaction)} >Save</button>
            </div>
            <div className="faction-upgrade-form">
                {Object.keys(faction.ships).map((shipName, index) => (
                    <ItemUpdater
                        key={index}
                        item={{name: toTitle(shipName), props:{...(newFaction[shipName].props)}}}
                        updateItem={(ship) => saveShip(shipName, ship)}
                        labelName={(x) => toTitle(shipPropsToDisplayName[x] || x)}
                        max={(x) => x === 'shields' ? 0 : 10}
                        min={(x) => x === 'shields' ? -10 : 0} />
                ))}
            </div>
        </div>
    );
}

export default FactionForm;

import React, {useState} from 'react';
import {Ship, ShipProps, shipPropsToDisplayName, SHIPTYPE} from "../ShipBuilder";
import {ItemUpdater} from "../components/StatContainer";
import {toTitle} from "../Formatter";
import {ShipEditor} from "./ShipEditor";
import PartSelector from "./PartSelector";

export interface Faction {
    name: string,
    ships: Record<string, Ship>,
}

interface FactionParams {
    saveFaction: (ship: Record<string, Ship>) => void;
    cancel: () => void;
    faction: Faction;
}

function FactionForm({saveFaction, cancel, faction}: FactionParams) {
    const [newFaction, setFaction] = useState(faction.ships);

    const saveShip = (shipName: string, props: Record<string, number>) => {
        setFaction({ ...newFaction, [shipName]: {name: newFaction[shipName]?.name || '', props: props as unknown as ShipProps }});
    };


    const ships = [SHIPTYPE.Interceptor, SHIPTYPE.Cruiser, SHIPTYPE.Dreadnought, SHIPTYPE.Starbase]
    const components = [[...Array(4)], [...Array(6)], [...Array(8)], [...Array(5)]]
    const builderType = true;
    return (
        <div className="faction-upgrade">
            <div className="faction-upgrade-title">
                <h1>{faction.name}</h1>
                <button onClick={() => saveFaction(newFaction)} >Save</button>
                <button onClick={() => cancel()} >Cancel</button>
            </div>
            <div className="faction-upgrade-form">
                { builderType ?
                    <div>
                        {ships.map((shipName, i) => (
                            <ShipEditor key={i} shipType={shipName} shipComponents={components[i]} baseStats={{initiative: 0, energy: 0}}/>
                        ))}
                        <PartSelector onSelected={() => 0} onCancel={() => 0}/>
                    </div>
                    :
                    Object.keys(faction.ships).map((shipName, index) => (
                        <ItemUpdater
                            key={index}
                            item={{name: toTitle(shipName), props:{...(newFaction[shipName].props)}}}
                            updateItem={(ship) => saveShip(shipName, ship)}
                            labelName={(x) => toTitle(shipPropsToDisplayName[x] || x)}
                            max={(x) => x === 'shields' ? 0 : 10}
                            min={(x) => x === 'shields' ? -10 : 0} />
                    ))
                }
            </div>

        </div>
    );
}

export default FactionForm;

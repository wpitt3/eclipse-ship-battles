import React, { useState } from 'react';
import './ShipUpgradeForm.css';
import ShipUpgradeForm, {Ship, ShipProps} from "./ShipUpgradeForm";

export interface Faction {
    name: string,
    ships: Record<string, Ship>,
}

function toShipData(props: Record<string, number>): ShipProps {
    const shipDataKeys = ['initiative', 'computers', 'shields', 'hull', 'cannon1', 'cannon2', 'cannon3', 'cannon4', 'missile1', 'missile2']
    const shipDataKeysAsMap = shipDataKeys.reduce((map, key) => {
        map[key] = 0;
        return map;
    }, {} as Record<string, number>);
    return {...shipDataKeysAsMap, ...props} as unknown as ShipProps;
}

function FactionForm() {
    const factionName = 'Ground'
    const factionShips = {
        interceptor: {name: 'Interceptor', props: toShipData({ initiative:3, 'cannon 1': 1 })},
        cruiser: {name: 'Cruiser', props: toShipData({ initiative:2, computers:1, hull: 1, 'cannon 1': 1 })},
        dreadnought: {name: 'Dreadnought', props: toShipData({ initiative:1, computers:1, hull: 2, 'cannon 1': 2 })},
        starbase: {name: 'Starbase', props: toShipData({ initiative:4, computers:1, hull: 2, 'cannon 1': 1 })},
    } as Record<string, Ship>

    const [faction, setFaction] = useState({
        interceptor: factionShips.interceptor,
        cruiser: factionShips.cruiser,
        dreadnought: factionShips.dreadnought,
        starbase: factionShips.starbase,
    });

    const saveShip = (shipName: string, ship: ShipProps) => {
        setFaction({ ...faction, [shipName]: ship });
    };

    return (
        <div>
            <h1>{factionName}</h1>
            <ShipUpgradeForm saveShip={(ship) => saveShip('interceptor', ship)} initShip={faction.interceptor} />
            <ShipUpgradeForm saveShip={(ship) => saveShip('cruiser', ship)} initShip={faction.cruiser} />
            <ShipUpgradeForm saveShip={(ship) => saveShip('dreadnought', ship)} initShip={faction.dreadnought} />
            <ShipUpgradeForm saveShip={(ship) => saveShip('starbase', ship)} initShip={faction.starbase} />
        </div>
    );
}

export default FactionForm;

import React, {useState} from 'react';
import {Ship, SHIPTYPE} from "../ShipBuilder";
import VisualFactionBuilder, {BaseStats} from "./VisualFactionBuilder";
import {calculateShipValues, validateFactionComponents} from "./ComponentManager";

export interface Faction {
    name: string,
    ships: Record<string, Ship>,
    components: Record<SHIPTYPE, number[]>,
    baseStats: Record<SHIPTYPE, BaseStats>
}

interface FactionParams {
    saveFaction: (ships: Record<string, Ship>, components: Record<SHIPTYPE, number[]>, baseStats: Record<SHIPTYPE, BaseStats>) => void;
    cancel: () => void;
    faction: Faction;
}

function FactionForm({saveFaction, cancel, faction}: FactionParams) {
    const [components, setComponents] = useState(faction.components);
    const [isValid, setIsValid] = useState(true);


    const save = () => {
        const ships: Record<string, Ship> = Object.fromEntries(Object.keys(components).map((shipName) => {
            return [shipName, {name: shipName, props: calculateShipValues(faction.baseStats[shipName as SHIPTYPE], components[shipName as SHIPTYPE])} as Ship]
        }));
        saveFaction(ships, components, faction.baseStats)
    }

    const updateComponents = (component: Record<SHIPTYPE, number[]>) => {
        setIsValid(validateFactionComponents(components, faction.baseStats));
        setComponents(component);
    }

    return (
        <div className="faction-upgrade">
            <div className="faction-upgrade-title">
                <h1>{faction.name}</h1>
                <button onClick={() => save()} disabled={!isValid} >Save</button>
                <button onClick={() => cancel()} >Cancel</button>
            </div>
            <div className="faction-upgrade-form">
                <VisualFactionBuilder components={components} baseStats={faction.baseStats} updateComponents={updateComponents}/>
            </div>

        </div>
    );
}

export default FactionForm;

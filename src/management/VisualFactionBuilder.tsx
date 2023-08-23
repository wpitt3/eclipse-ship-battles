import React, {useState} from 'react';
import {SHIPTYPE} from "../ShipBuilder";

import {ShipEditor} from "./ShipEditor";
import PartSelector from "./PartSelector";
import "./ShipEditor.css"

export interface BaseStats {
    initiative: number,
    energy: number
}

interface Params {
    components: Record<SHIPTYPE, number[]>
    baseStats: Record<SHIPTYPE, BaseStats>
    updateComponents: (components: Record<SHIPTYPE, number[]>) => void
}

function VisualFactionBuilder({components, baseStats, updateComponents}: Params) {
    const [compIndex, setIndex] = useState<number>();
    const [shiptype, setShipType] = useState<SHIPTYPE>();

    const updateComponent = (componentId: number) => {
        if (shiptype !== undefined && compIndex !== undefined) {
            const newComponents = components;
            newComponents[shiptype][compIndex] = componentId
            updateComponents(newComponents);
            setShipType(undefined);
            setIndex(undefined);
        }
    };

    const onCancel = () => {
        setShipType(undefined);
        setIndex(undefined);
    };

    const ships = [SHIPTYPE.Interceptor, SHIPTYPE.Cruiser, SHIPTYPE.Dreadnought, SHIPTYPE.Starbase]
    return (
        <div>
            <div className={"ship-editor-wrapper"}>
                {ships.map((shipName, i) => (
                    <ShipEditor key={i} shipType={shipName} shipComponents={components[shipName]} baseStats={baseStats[shipName]} onSelected={(newShiptype, newCompIndex) => {
                        setShipType(newShiptype);
                        setIndex(newCompIndex);
                    }}/>
                ))}
            </div>
            {!shiptype || <PartSelector onSelected={(id) => updateComponent(id)} onCancel={onCancel}/>}
        </div>
    );
}

export default VisualFactionBuilder;

import {toTitle} from "../Formatter";
import React, {useState} from "react";
import {shipPropsToDisplayName, SHIPTYPE} from "../ShipBuilder";
import {FactionStats} from "./FactionStats";
import "./ShipEditor.css"

interface BaseStats {
    initiative: number;
    energy: number;
}

interface FactionParams {
    shipType: SHIPTYPE;
    shipComponents: number[];
    baseStats: BaseStats;
}

const shipTypeToSquares: Record<SHIPTYPE, number> = {
    [SHIPTYPE.Interceptor] : 4,
    [SHIPTYPE.Cruiser]: 6,
    [SHIPTYPE.Dreadnought]: 8,
    [SHIPTYPE.Starbase]: 5,
}

export function ShipEditor({shipType, shipComponents, baseStats}: FactionParams) {
    const [components, setComponents] = useState<number[]>(shipComponents);

    return (
        <div className={"ship-wrapper ship-wrapper-" + shipType}>
            { components.map((value, i) => {
               return (<div key={i} onClick={() => console.log(i)} className={"component-slot component-slot-" + i} ></div>);
            })}
        </div>
    );
}


import React from "react";
import {SHIPTYPE} from "../ShipBuilder";
import "./ShipEditor.css"
import {idToPart} from "./PartDetails";
import PartBlock from "./PartBlock";

interface BaseStats {
    initiative: number;
    energy: number;
}

interface FactionParams {
    shipType: SHIPTYPE;
    shipComponents: number[];
    baseStats: BaseStats;
    onSelected: (shiptype: SHIPTYPE, index: number) => void;
}

export function ShipEditor({shipType, shipComponents, onSelected}: FactionParams) {

    return (
        <div className={"ship-wrapper ship-wrapper-" + shipType}>
            { shipComponents.map((value, i) => {
               return (<div key={i} onClick={() => onSelected(shipType, i)} className={"component-slot component-slot-" + i} >
                   {value === 0 || <PartBlock key={i} part={idToPart[value]} unique={value > 24}/>}
               </div>);
            })}
        </div>
    );
}

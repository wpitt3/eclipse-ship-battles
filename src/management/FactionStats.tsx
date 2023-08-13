import {toTitle} from "../Formatter";
import React from "react";
import {Faction} from "./FactionForm";
import {shipPropsToDisplayName} from "../ShipBuilder";

interface FactionParams {
    faction: Faction;
    editable: boolean;
    editFunction?: (value: string) => void;
    deleteFunction?: (value: string) => void;
}

export function FactionStats({faction, editable, editFunction, deleteFunction}: FactionParams) {
    return (<div className="faction-wrapper">
            <div className="faction-header">
                <div className="faction-name">{faction.name}</div>
                { !editable || !editFunction || <button className="faction-button" onClick={() => editFunction(faction.name)}>Edit</button> }
                { !editable || !deleteFunction || <button className="faction-button" onClick={() => deleteFunction(faction.name)}>Delete</button> }
            </div>
            <div className="faction-ships">
                {Object.keys(faction.ships).map((shipName, ii) => {
                    const ship = faction.ships[shipName];
                    return <div key={ii} className={"faction-ship " + (ii % 2 === 0 ? "faction-ship-odd-col" : "")}>
                        <div className="ship-name">{toTitle(ship.name)}</div>
                        {Object.keys(ship.props).map((propName, iii) => {
                            const propValue: number = {...ship.props}[propName] || 0;
                            if (propValue !== 0) {
                                return <div key={iii} className="faction-ship-prop">
                                    <div className="faction-ship-prop-name">{shipPropsToDisplayName[propName]}:</div><div className="faction-ship-prop-value">{propValue}</div>
                                </div>
                            }
                        })}
                    </div>
                })}
            </div>
        </div>
    );
}

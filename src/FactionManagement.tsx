import React, { useState } from 'react';
import './ShipUpgradeForm.css';
import {Ship, ShipProps} from "./ShipUpgradeForm";
import FactionForm, {Faction} from "./FactionForm";
import {toTitle} from "./Formatter";
import './FactionManagement.css';

function toShipData(props: Record<string, number>): ShipProps {
    const shipDataKeys = ['initiative', 'computers', 'shields', 'hull', 'ion_cannon', 'plasma_cannon', 'soliton_cannon', 'antimatter_cannon', 'flux_missile', 'plasma_missile']
    const shipDataKeysAsMap = shipDataKeys.reduce((map, key) => {
        map[key] = 0;
        return map;
    }, {} as Record<string, number>);
    return {...shipDataKeysAsMap, ...props} as unknown as ShipProps;
}

function createFaction(name: string): Faction {
    return {
        name: name,
        ships: {
        interceptor: {name: 'Interceptor', props: toShipData({initiative: 3, 'ion_cannon': 1})},
        cruiser: {name: 'Cruiser', props: toShipData({initiative: 2, computers: 1, hull: 1, 'ion_cannon': 1})},
        dreadnought: {name: 'Dreadnought', props: toShipData({initiative: 1, computers: 1, hull: 2, 'ion_cannon': 2})},
        starbase: {name: 'Starbase', props: toShipData({initiative: 4, computers: 1, hull: 2, 'ion_cannon': 1})},
    } as Record<string, Ship>
    }
}

function FactionManagement() {
    const [name, setName] = useState('');
    const [factions, setFactions] = useState<Array<Faction>>([]);
    const [editing, setEditing] = useState<number>(-1);

    const handleCreateFaction = () => {
        if (name !== '') {
            const newFaction = createFaction(name)
            const factionId = factions.length
            setFactions([...factions, newFaction])
            setEditing(factionId)
            setName('');
        }
    };

    const handleEditFaction = (index: number) => {
        setEditing(index);
    };

    const handleDeleteFaction = (index: number) => {
        const newFactions = [...factions]
        newFactions.splice(index, 1)
        setFactions(newFactions);
    };

    const saveFaction = (ships: Record<string, Ship>) => {
        const newFactions = [...factions]
        newFactions[editing].ships = ships;
        setFactions(newFactions)
        setEditing(-1)
    };

    return (
        <div className="factions-wrapper">
            {editing !== -1 || <div className="view-factions">
                <h2>Faction Management</h2>
                <div className="create-faction">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleCreateFaction}>Create</button>
                </div>
                <div className="existing-factions">
                    {factions.map((faction, index) => (
                        <div key={index} className="faction-wrapper">
                            <div className="faction-name">{faction.name}</div>
                            <button className="faction-button" onClick={() => handleEditFaction(index)}>Edit</button>
                            <button className="faction-button" onClick={() => handleDeleteFaction(index)}>Delete</button>
                            {Object.keys(faction.ships).map((shipName, index) => {
                                const ship = faction.ships[shipName];
                                return <div key={index} className="faction-ship">
                                    <div className="ship-name">{ship.name}</div>
                                    {Object.keys(ship.props).map((propName, index) => {
                                        const propValue: number = {...ship.props}[propName] || 0;
                                        if (propValue !== 0) {
                                            return <div key={index} className="faction-ship-prop">
                                                <div className="faction-ship-prop-name">{toTitle(propName)}:</div><div className="faction-ship-prop-value">{propValue}</div>
                                            </div>
                                        }
                                    })}
                                </div>
                            })}
                        </div>
                    ))}
                </div>
            </div>}
            {editing === -1 || <FactionForm saveFaction={saveFaction} faction={factions[editing]}/>}
        </div>
    )
}

export default FactionManagement;

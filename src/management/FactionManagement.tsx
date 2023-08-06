import React, {useState} from 'react';
import './ShipUpgradeForm.css';
import {Ship} from "../ShipBuilder";
import FactionForm from "./FactionForm";
import {toTitle} from "../Formatter";
import './FactionManagement.css';
import {FactionManager} from "./FactionManager";

function FactionManagement() {
    const [name, setName] = useState('');
    const [unused, setUnused] = useState(false);

    const factionManager = new FactionManager();
    const [editing, setEditing] = useState<string>('');
    const handleCreateFaction = () => {
        if (name !== '' && !factionManager.includes(name)) {
            factionManager.create(name);
            setEditing(name);
            setName('');
        }
    };

    const handleEditFaction = (factionName: string) => {
        setEditing(factionName);
    };

    const handleDeleteFaction = (factionName: string) => {
        factionManager.remove(factionName)
        setUnused(!unused);
    };

    const saveFaction = (ships: Record<string, Ship>) => {
        factionManager.setShips(editing, ships);
        setEditing('')
    };

    return (
        <div className="factions-wrapper">
            {editing !== '' || <div className="view-factions">
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
                    { factionManager.getNames().map((factionName, i) => {
                        const faction = factionManager.get(factionName);
                        return (<div key={i} className="faction-wrapper">
                            <div className="faction-name">{faction.name}</div>
                            { !factionManager.isEditable(faction.name) || <button className="faction-button" onClick={() => handleEditFaction(faction.name)}>Edit</button> }
                            { !factionManager.isEditable(faction.name) || <button className="faction-button" onClick={() => handleDeleteFaction(faction.name)}>Delete</button> }
                            {Object.keys(faction.ships).map((shipName, ii) => {
                                const ship = faction.ships[shipName];
                                return <div key={ii} className="faction-ship">
                                    <div className="ship-name">{ship.name}</div>
                                    {Object.keys(ship.props).map((propName, iii) => {
                                        const propValue: number = {...ship.props}[propName] || 0;
                                        if (propValue !== 0) {
                                            return <div key={iii} className="faction-ship-prop">
                                                <div className="faction-ship-prop-name">{toTitle(propName)}:</div><div className="faction-ship-prop-value">{propValue}</div>
                                            </div>
                                        }
                                    })}
                                </div>
                            })}
                        </div>
                        )}
                    )}
                </div>
            </div>}
            {editing === '' || <FactionForm saveFaction={saveFaction} faction={factionManager.get(editing)}/>}
        </div>
    )
}

export default FactionManagement;

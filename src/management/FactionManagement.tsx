import React, {useState} from 'react';
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

    const shipPropsToDisplayName: Record<string, string> = {
        initiative: 'Init',
        computers: 'Comps',
        shields: 'Shields',
        hull: 'Hull',
        ionCannon: 'Ion C',
        plasmaCannon: 'Plasma C',
        solitonCannon: 'Soli C',
        antimatterCannon: 'AntiM C',
        ionMissile: 'Ion M',
        plasmaMissile: 'Plasma M',
        solitonMissile: 'Soli C',
        antimatterMissile: 'AntiM C',
    }

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
                            <div className="faction-header">
                                <div className="faction-name">{faction.name}</div>
                                { !factionManager.isEditable(faction.name) || <button className="faction-button" onClick={() => handleEditFaction(faction.name)}>Edit</button> }
                                { !factionManager.isEditable(faction.name) || <button className="faction-button" onClick={() => handleDeleteFaction(faction.name)}>Delete</button> }
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
                        )}
                    )}
                </div>
            </div>}
            {editing === '' || <FactionForm saveFaction={saveFaction} faction={factionManager.get(editing)} propsToDisplayName={shipPropsToDisplayName}/>}
        </div>
    )
}

export default FactionManagement;

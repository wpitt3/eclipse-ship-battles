import React, {useState} from 'react';
import {Ship} from "../ShipBuilder";
import FactionForm from "./FactionForm";
import './FactionManagement.css';
import {FactionManager} from "./FactionManager";
import {ExistingFaction} from "./ExistingFaction";

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
                        return (
                            <ExistingFaction
                            key={i}
                            faction={faction}
                            editable={factionManager.isEditable(faction.name)}
                            editFunction={() => handleEditFaction(faction.name)}
                            deleteFunction={() => handleDeleteFaction(faction.name)}
                            />);
                    })}
                </div>
            </div>}
            {editing === '' || <FactionForm saveFaction={saveFaction} faction={factionManager.get(editing)} />}
        </div>
    )
}

export default FactionManagement;

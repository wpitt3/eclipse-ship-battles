import React, {useState} from 'react';
import {Ship} from "../ShipBuilder";
import './BattleManage.css';
import Dropdown from "../components/Dropdown";
import {ItemUpdater} from "../components/StatContainer";
import {BattleEngine} from "./BattleEngine";
import {FactionManager} from "../management/FactionManager";

function BattleManage() {
    const factionManager = new FactionManager();
    // const namesManager = new TypedNamedLocalStorage<Array<string>>([], 'factionNames')
    const shipsToFreq = (a: Record<string, Ship>) => Object.fromEntries(Object.keys(a).map((x) => { return [x, 0]})) as Record<string, number>
    const [attackerName, setAttackerName] = useState<string>('');
    const [defenderName, setDefenderName] = useState<string>('');
    const [attackerShips, setAttackerShips] = useState<Record<string, number>>({});
    const [defenderShips, setDefenderShips] = useState<Record<string, number>>({});
    const [winRate, setWinRate] = useState<number>(0);

    const setAttacker = (name: string) => {
        setAttackerName(name);
        setAttackerShips(shipsToFreq(factionManager.get(name).ships))
    };

    const setDefender = (name: string) => {
        setDefenderName(name);
        setDefenderShips(shipsToFreq(factionManager.get(name).ships));
    };

    const performBattle = () => {
        //async this
        const battleEngine = new BattleEngine(factionManager.get(attackerName).ships, factionManager.get(defenderName).ships);
        const battles = 10000;
        let wins = 0;

        [...Array(battles)].forEach(() => {
            const result = battleEngine.battle(attackerShips, defenderShips);
            if (result === -1) {
                wins += 1;
            }
        });
        setWinRate(wins/battles);
    };

    const attackerNames = factionManager.getNames().filter((name) => name !== defenderName);
    const defenderNames = factionManager.getNames().filter((name) => name !== attackerName);

    const shipNameToMax = { interceptor: 8, cruiser: 4, dreadnought:2, starbase: 4 } as Record<string, number>;

    return (
        <div className="battle-wrapper">
            <br/>
            <br/>
            <Dropdown label={'Attacker: '} options={attackerNames} onSelect={setAttacker} className={'arr'} dropdownId={'att'} />
            <Dropdown label={'Defender: '} options={defenderNames} onSelect={setDefender} className={'arr'} dropdownId={'def'} />
            { !attackerName || !defenderName || <div className="ship-selector">

                <ItemUpdater item={{name: attackerName, props:attackerShips}} updateItem={setAttackerShips} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} ></ItemUpdater>
                <ItemUpdater item={{name: defenderName, props:defenderShips}} updateItem={setDefenderShips} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} ></ItemUpdater>
                <button onClick={() => performBattle()} >Battle</button>
                <div >Winrate: {winRate}</div>
            </div>
            }
        </div>
    )
}

export default BattleManage;

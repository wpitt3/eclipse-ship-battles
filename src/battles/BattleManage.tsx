import React, {useState} from 'react';
import './BattleManage.css';
import Dropdown from "../components/Dropdown";
import {ItemUpdater} from "../components/StatContainer";
import {BattleEngine} from "./BattleEngine";
import {FactionManager} from "../management/FactionManager";
import {toTitle} from "../Formatter";

function BattleManage() {
    const factionManager = new FactionManager();
    const shipsToFreq = (shipNames: Array<string>) => Object.fromEntries(shipNames.map((name) => { return [name, 0]})) as Record<string, number>
    const [attackerName, setAttackerName] = useState<string>('');
    const [defenderName, setDefenderName] = useState<string>('');
    const [attackerShips, setAttackerShips] = useState<Record<string, number>>({});
    const [defenderShips, setDefenderShips] = useState<Record<string, number>>({});
    const [winRate, setWinRate] = useState<number>(0);
    const [remainingShips, setRemainingShips] = useState<[string, number][]>([]);

    const setAttacker = (name: string) => {
        setAttackerName(name);
        setAttackerShips(shipsToFreq(Object.keys(factionManager.get(name).ships).filter((shipName) => shipName !== 'starbase')))
    };

    const setDefender = (name: string) => {
        setDefenderName(name);
        setDefenderShips(shipsToFreq(Object.keys(factionManager.get(name).ships)));
    };

    const asPercentage = (score: number) => {
        return Math.round(score * 1000) / 10;
    }

    const performBattle = () => {
        //async this
        const battleEngine = new BattleEngine(factionManager.get(attackerName).ships, factionManager.get(defenderName).ships);
        const battles = 10000;
        const results = battleEngine.battles(attackerShips, defenderShips, battles);
        const winningBattles = Object.fromEntries(Object.entries(results)
            .filter(([key]) => parseInt(key) > 0)
            .map(([key, value]) => [key, value/ battles]));
        const wins = Object.values(winningBattles).reduce((sum, value) => sum + value, 0);
        setWinRate(wins);
        setRemainingShips(Object.entries(winningBattles).sort().reverse())
    };

    const attackerNames = factionManager.getNames().filter((name) => name !== defenderName && !factionManager.defendingOnlyFactions().includes(name));
    const defenderNames = factionManager.getNames().filter((name) => name !== attackerName);

    const shipNameToMax = { interceptor: 8, cruiser: 4, dreadnought:2, starbase: 4 } as Record<string, number>;

    return (
        <div className="ship-battle-wrapper">
            <Dropdown label={'Attacker: '} options={attackerNames} onSelect={setAttacker} className={'attacker-select'} dropdownId={'att'} />
            <Dropdown label={'Defender: '} options={defenderNames} onSelect={setDefender} className={'defender-select'} dropdownId={'def'} />
            { !attackerName || !defenderName || <div className="ship-battler">
                <div className="ship-selector">
                    <ItemUpdater item={{name: attackerName, props:attackerShips}} updateItem={setAttackerShips} labelName={(x) => toTitle(x)} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} ></ItemUpdater>
                    <ItemUpdater item={{name: defenderName, props:defenderShips}} updateItem={setDefenderShips} labelName={(x) => toTitle(x)} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} ></ItemUpdater>
                </div>
                    <button className="battle-button" onClick={() => performBattle()}>Battle</button>
                    <div className='result'>
                        <div key={-1} className='result-header'><div className='result-title'>Winrate</div><div className='result-value'>{asPercentage(winRate) + "%"}</div></div>
                        { remainingShips.map(([x, y], i) =>
                            <div key={i} className='result-row'><div className='result-title'>{"Ships " + x}</div><div className='result-value'>{asPercentage(y) + "%"}</div></div>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default BattleManage;

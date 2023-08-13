import React, {useState} from 'react';
import './BattleManage.css';
import Dropdown from "../components/Dropdown";
import {ItemUpdater} from "../components/StatContainer";
import {BattleEngine} from "./BattleEngine";
import {FactionManager} from "../management/FactionManager";
import {toTitle} from "../Formatter";
import {ExistingFaction} from "../management/ExistingFaction";
import {TypedNamedLocalStorage} from "../TypedLocalStorage";
import {Faction} from "../management/FactionForm";

function shipsToFreq(faction: Faction, isAttacking: boolean): Record<string, number> {
    let shipNames = Object.keys(faction.ships);
    if (isAttacking) {
        shipNames = shipNames.filter((shipName) => shipName !== 'starbase')
    }
    return Object.fromEntries(shipNames.map((name) => { return [name, 0]}))
}

function BattleManage() {
    const factionManager = new FactionManager();
    const attackerName = new TypedNamedLocalStorage<string>('', 'attacker')
    const defenderName = new TypedNamedLocalStorage<string>('', 'defender')

    const [attackerShips, setAttackerShips] = useState<Record<string, number>>(!!attackerName.get() ? shipsToFreq(factionManager.get(attackerName.get()), true) : {});
    const [defenderShips, setDefenderShips] = useState<Record<string, number>>(!!defenderName.get() ? shipsToFreq(factionManager.get(defenderName.get()), false) : {});
    const [winRate, setWinRate] = useState<number>(0);
    const [remainingShips, setRemainingShips] = useState<[string, number][]>([]);

    const resetWins = () => {
        setWinRate(0);
        setRemainingShips([])
    }

    const setAttacker = (name: string) => {
        attackerName.set(name);
        setAttackerShips(shipsToFreq(factionManager.get(name), true));
        resetWins();
    };

    const setDefender = (name: string) => {
        defenderName.set(name);
        setDefenderShips(shipsToFreq(factionManager.get(name), false));
        resetWins();
    };

    const asPercentage = (score: number) => {
        return Math.round(score * 1000) / 10;
    }

    const performBattle = () => {
        //async this
        const battleEngine = new BattleEngine(factionManager.get(attackerName.get()).ships, factionManager.get(defenderName.get()).ships);
        const battles = 10000;
        const results = battleEngine.battles(attackerShips, defenderShips, battles);
        const winningBattles = Object.fromEntries(Object.entries(results)
            .filter(([key]) => parseInt(key) > 0)
            .map(([key, value]) => [key, value/ battles]));
        const wins = Object.values(winningBattles).reduce((sum, value) => sum + value, 0);
        setWinRate(wins);
        setRemainingShips(Object.entries(winningBattles).sort().reverse())
    };

    const attackerNames = factionManager.getNames().filter((name) => name !== defenderName.get() && !factionManager.defendingOnlyFactions().includes(name));
    const defenderNames = factionManager.getNames().filter((name) => name !== attackerName.get());
    const shipNameToMax = { interceptor: 8, cruiser: 4, dreadnought:2, starbase: 4 } as Record<string, number>;
    const attackingShipCount = Object.values(attackerShips).reduce((sum, value) => sum + value, 0);
    const defendingShipCount = Object.values(defenderShips).reduce((sum, value) => sum + value, 0);

    return (
        <div className="ship-battle-wrapper">
            <div className="battle-faction-selection">
                <Dropdown label={'Attacker: '} options={attackerNames} onSelect={setAttacker} className={'attacker-select'} dropdownId={'att'} defaultValue={attackerName.get()}/>
                <Dropdown label={'Defender: '} options={defenderNames} onSelect={setDefender} className={'defender-select'} dropdownId={'def'} defaultValue={defenderName.get()}/>
            </div>
            { !attackerName.get() || !defenderName.get() || <div className="ship-battler">
                <div>
                    <ExistingFaction
                        key={0}
                        faction={factionManager.get(attackerName.get())}
                        editable={false}
                    />
                    <ExistingFaction
                        key={1}
                        faction={factionManager.get(defenderName.get())}
                        editable={false}
                    />
                </div>
                <div className="ship-selector">
                    <ItemUpdater item={{name: attackerName.get(), props:attackerShips}} updateItem={setAttackerShips} labelName={(x) => toTitle(x)} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} onChange={resetWins}></ItemUpdater>
                    <ItemUpdater item={{name: defenderName.get(), props:defenderShips}} updateItem={setDefenderShips} labelName={(x) => toTitle(x)} max={(name) => shipNameToMax[name] || 4 } min={()=> 0} onChange={resetWins}></ItemUpdater>
                </div>
                    { !attackingShipCount || !defendingShipCount || <div>
                        <button className="battle-button" onClick={() => performBattle()}>Battle</button>
                        <div className='result'>
                            <div key={-1} className='result-header'><div className='result-title'>Winrate</div><div className='result-value'>{asPercentage(winRate) + "%"}</div></div>
                            { remainingShips.map(([x, y], i) =>
                                <div key={i} className='result-row'><div className='result-title'>{"Ships " + x}</div><div className='result-value'>{asPercentage(y) + "%"}</div></div>
                            )}
                        </div>
                    </div>}
                </div>
            }
        </div>
    )
}

export default BattleManage;

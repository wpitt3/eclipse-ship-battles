import {ShipBuilder, Ship} from "../ShipBuilder";

enum AttackType {
    CANNON,
    MISSILE
}

enum TEAM {
    ATTACKER,
    DEFENDER
}

interface ShipAttack {
    team: TEAM,
    attack: AttackType,
    ships: Ship[]
}

interface Attack {
    value: number,
    strength: number
}

interface Winner {
    winner: number,
    remainingShips: number
}

export class BattleEngine {
    private readonly aShipDesigns: Record<string, Ship>;

    private readonly dShipDesigns: Record<string, Ship>;

    constructor(aShips: Record<string, Ship>, bShips: Record<string, Ship>) {
        this.aShipDesigns = aShips;
        this.dShipDesigns = bShips;
    }

    battles(aFreq: Record<string, number>, dFreq: Record<string, number>, battles: number): Record<number, number> {
        const results: Record<number, number> = {};

        [...Array(battles)].forEach(() => {
            const result = this.battle(aFreq, dFreq);
            results[result.winner * result.remainingShips] = (results[result.winner * result.remainingShips] || 0) + 1;
        });

        return results;
    }

    battle(aFreq: Record<string, number>, dFreq: Record<string, number>): Winner {
        let { missileAttacks, cannonAttacks, attackerShips, defenderShips } = this.initialiseShips(aFreq, dFreq);

        missileAttacks.forEach((attack) => {
            const attackHits = this.calculateAttack(attack.attack, attack.ships[0], attack.ships.length);
            const ships = attack.team == TEAM.ATTACKER ? defenderShips : attackerShips;
            const targets = this.chooseShipToAttack(attackHits, ships);
            let kill = false
            targets.forEach((target, i) => {
                if (attackHits[i].value + ships[target].props.shields >= 6) {
                    ships[target].props.hull -= attackHits[i].strength;
                    if (ships[target].props.hull < 0) {
                        kill = true;
                    }
                }
            });
            if (kill) {
                missileAttacks = missileAttacks.map((it) => {
                    return {...it, ships: attack.ships.filter((ship) => ship.props.hull >= 0)}
                }).filter((it) => it.ships.length > 0);
                cannonAttacks = cannonAttacks.map((it) => {
                    return {...it, ships: attack.ships.filter((ship) => ship.props.hull >= 0)}
                }).filter((it) => it.ships.length > 0);
                if (attack.team == TEAM.ATTACKER) {
                    defenderShips = defenderShips.filter((ship) => ship.props.hull >= 0)
                } else {
                    attackerShips = attackerShips.filter((ship) => ship.props.hull >= 0)
                }
            }
        });

        while (defenderShips.length > 0 && attackerShips.length > 0 && cannonAttacks.length > 0) {
            for (let i = 0; i < cannonAttacks.length; i++) {
                if (defenderShips.length == 0 || attackerShips.length == 0) {
                    continue;
                }
                const attack = cannonAttacks[i];
                const attackHits = this.calculateAttack(attack.attack, attack.ships[0], attack.ships.length);
                const ships = attack.team == TEAM.ATTACKER ? defenderShips : attackerShips;
                const targets = this.chooseShipToAttack(attackHits, ships);
                let kill = false
                targets.forEach((target, x) => {
                    if (attackHits[x].value + ships[target].props.shields >= 6) {
                        ships[target].props.hull -= attackHits[x].strength;
                        if (ships[target].props.hull < 0) {
                            kill = true;
                        }
                    }
                });
                if (kill) {
                    cannonAttacks = cannonAttacks.map((it) => {
                        return {...it, ships: it.ships.filter((ship) => ship.props.hull >= 0)}
                    });
                    // not nice hack around editing attacks whilst looping through them
                    const indicesOffset = cannonAttacks.reduce((count: number, value, index) => (value.ships.length === 0 && index < i ? 1 : 0) + count, 0);
                    i -= indicesOffset;

                    cannonAttacks = cannonAttacks.filter((it) => it.ships.length > 0)
                    if (attack.team == TEAM.ATTACKER) {
                        defenderShips = defenderShips.filter((ship) => ship.props.hull >= 0)
                    } else {
                        attackerShips = attackerShips.filter((ship) => ship.props.hull >= 0)
                    }
                }
            }
        }

        if (attackerShips.length == 0) {
            return {winner: -1, remainingShips: defenderShips.length};
        }

        if (defenderShips.length == 0){
            return {winner: 1, remainingShips: attackerShips.length};
        }
        return {winner: 0, remainingShips: attackerShips.length + defenderShips.length};
    }

    initialiseShips(aFreq: Record<string, number>, dFreq: Record<string, number>): {
        missileAttacks: ShipAttack[],
        cannonAttacks: ShipAttack[],
        attackerShips: Ship[],
        defenderShips: Ship[]
    } {
        const filterNonZero = (a: Record<string, number>) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== 0));
        const attackerShips = this.createShips(filterNonZero(aFreq), this.aShipDesigns);
        const defenderShips = this.createShips(filterNonZero(dFreq), this.dShipDesigns);
        const missileAttacks = this.joinRecordAndSortByKey(
            this.createShipAttacks(defenderShips, TEAM.DEFENDER, AttackType.MISSILE),
            this.createShipAttacks(attackerShips, TEAM.ATTACKER, AttackType.MISSILE)
        );
        const cannonAttacks = this.joinRecordAndSortByKey(
            this.createShipAttacks(defenderShips, TEAM.DEFENDER, AttackType.CANNON),
            this.createShipAttacks(attackerShips, TEAM.ATTACKER, AttackType.CANNON)
        );
        return {
            attackerShips: Object.values(attackerShips).flat(),
            defenderShips: Object.values(defenderShips).flat(),
            missileAttacks,
            cannonAttacks,
        };
    }

    private joinRecordAndSortByKey(a: Record<number, ShipAttack>, b: Record<number, ShipAttack>) {
        const toSort = Object.entries(a).concat(Object.entries(b));
        return toSort.sort(([c], [d]) => c.localeCompare(d)).map(([, v]) => v).reverse();
    }

    private createShips(frequency: Record<string, number>, shipDesigns: Record<string, Ship>) {
        const ships: Record<string, Ship[]> = {};
        Object.keys(frequency).forEach( (shipName) => {
            ships[shipName] = Array.from(Array(frequency[shipName])).map( () => ShipBuilder.clone(shipDesigns[shipName]));
        })
        return ships;
    }

    private createShipAttacks(ships: Record<string, Ship[]>, team: TEAM, attack: AttackType) {
        const orderToShips: Record<number, ShipAttack> = {};
        Object.keys(ships).forEach( (shipName, i) => {
            const ship = ships[shipName][0].props;
            const initiative = ship.initiative + (team == TEAM.DEFENDER ? 0.5 : 0) + i * 0.001;
            const hasMissileAttack = ship.ionMissile + ship.plasmaMissile != 0;
            const hasCannonAttack = ship.ionCannon + ship.plasmaCannon + ship.solitonCannon + ship.antimatterCannon != 0;
            if ( (attack == AttackType.MISSILE && hasMissileAttack) || (attack == AttackType.CANNON && hasCannonAttack)) {
                orderToShips[initiative] = orderToShips[initiative] || {team, attack, ships:[]};
                const shipsForInit = ships[shipName];
                orderToShips[initiative].ships = orderToShips[initiative].ships.concat(shipsForInit);
            }
            // what happens to ships with no weapons?
        })
        return orderToShips;
    }

    calculateAttack(attack: AttackType, ship: Ship, size: number): Attack[]{
        const { computers, ionMissile, plasmaMissile, solitonMissile, antimatterMissile, ionCannon, plasmaCannon, solitonCannon, antimatterCannon } = ship.props;
        let attacks: Attack[] = []
        if (attack == AttackType.MISSILE) {
            attacks = attacks.concat(this.createAttacks(computers, ionMissile * size, 1));
            attacks = attacks.concat(this.createAttacks(computers, plasmaMissile * size, 2));
            attacks = attacks.concat(this.createAttacks(computers, solitonMissile * size, 3));
            attacks = attacks.concat(this.createAttacks(computers, antimatterMissile * size, 4));
        }
        if (attack == AttackType.CANNON) {
            attacks = attacks.concat(this.createAttacks(computers, ionCannon * size, 1));
            attacks = attacks.concat(this.createAttacks(computers, plasmaCannon * size, 2));
            attacks = attacks.concat(this.createAttacks(computers, solitonCannon * size, 3));
            attacks = attacks.concat(this.createAttacks(computers, antimatterCannon * size, 4));
        }
        return attacks
    }

    private createAttacks(computers: number, count: number, strength: number): Attack[] {
        return [...Array(count)].map(() => this.rollDie())
            // 6 is always hit, 1 is always miss
            .map((it) => it === 6 ? 100 : (it === 1 ? -100 : it + computers))
            .filter((it) => it >= 6)
            .map((value) => { return {strength, value}})
    }

    rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    chooseShipToAttack(attacks: Attack[], ships: Ship[]) {
        const currentHealth = ships.map((ship) => ship.props.hull + 1)

        let currentAttackIndex = 0;

        return attacks.map((val) => {
            if (currentHealth[currentAttackIndex] <= 0 && currentAttackIndex < currentHealth.length -1) {
                currentAttackIndex++;
            }
            currentHealth[currentAttackIndex] -= val.strength;
            return currentAttackIndex;
        })
    }
}
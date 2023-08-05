import {BattleEngine} from './BattleEngine';
import {Ship, ShipBuilder} from "../ShipBuilder";

describe('BattleEngine', () => {
    describe('initialiseShips', () => {
        it('should correctly initialise ships and attacks', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const cruiser = ShipBuilder.cruiser().build();

            const attackerShipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const frequency: Record<string, number> = { interceptor: 2, cruiser: 1};
            const battleEngine = new BattleEngine(attackerShipDesigns, {});

            const {missileAttacks, cannonAttacks, attackerShips, defenderShips} = battleEngine.initialiseShips(frequency, {});

            expect(missileAttacks).toStrictEqual([]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 0, ships:[interceptor, interceptor]},
                {attack: 0, team: 0, ships:[cruiser]}
            ]);
            expect(attackerShips).toStrictEqual([interceptor, interceptor, cruiser]);
            expect(defenderShips).toStrictEqual([]);
        });

        it('should should be cloned so modifying one does not modify another', () => {
            const interceptor = ShipBuilder.interceptor().build();

            const attackerShipDesigns: Record<string, Ship> = {interceptor};
            const frequency: Record<string, number> = { interceptor: 2};
            const battleEngine = new BattleEngine(attackerShipDesigns, {});

            const {missileAttacks, cannonAttacks, attackerShips, defenderShips} = battleEngine.initialiseShips(frequency, {});

            attackerShips[0].props.hull = -1;

            const deadInterceptor = ShipBuilder.interceptor().withHull(-1).build();

            expect(missileAttacks).toStrictEqual([]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 0, ships:[deadInterceptor, interceptor]},
            ]);
            expect(attackerShips).toStrictEqual([deadInterceptor, interceptor]);
            expect(defenderShips).toStrictEqual([]);
        });

        it('should handle 0 freq', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const cruiser = ShipBuilder.cruiser().build();

            const shipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const aShips: Record<string, number> = { interceptor: 1, cruiser: 0, dreadnought: 0, starbase: 0};
            const bShips: Record<string, number> = { interceptor: 0, cruiser: 1, dreadnought: 0, starbase: 0};
            const battleEngine = new BattleEngine(shipDesigns, shipDesigns);

            const {missileAttacks, cannonAttacks} = battleEngine.initialiseShips(aShips, bShips);

            expect(missileAttacks).toStrictEqual([]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 0, ships:[interceptor]},
                {attack: 0, team: 1, ships:[cruiser]},
            ]);
        });

        it('should order attacks by initiative defender first', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const cruiser = ShipBuilder.cruiser().build();

            const attackerShipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const defenderShipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const frequency: Record<string, number> = { interceptor: 1, cruiser: 1};
            const battleEngine = new BattleEngine(attackerShipDesigns, defenderShipDesigns);

            const {missileAttacks, cannonAttacks, attackerShips, defenderShips} = battleEngine.initialiseShips(frequency, frequency);

            expect(missileAttacks).toStrictEqual([]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 1, ships:[interceptor]},
                {attack: 0, team: 0, ships:[interceptor]},
                {attack: 0, team: 1, ships:[cruiser]},
                {attack: 0, team: 0, ships:[cruiser]}
            ]);
            expect(attackerShips).toStrictEqual([interceptor, cruiser]);
            expect(defenderShips).toStrictEqual([interceptor, cruiser]);
        });

        it('ships should only appear in appropriate attack lists', () => {
            const missileInterceptor = ShipBuilder.interceptor().withIonCannon(0).withFluxMissile(1).build();
            const cruiser = ShipBuilder.cruiser().build();
            const missileAndCannonCruiser = ShipBuilder.cruiser().withFluxMissile(1).build();

            const attackerShipDesigns: Record<string, Ship> = {interceptor: missileInterceptor, cruiser};
            const defenderShipDesigns: Record<string, Ship> = {cruiser: missileAndCannonCruiser};
            const battleEngine = new BattleEngine(attackerShipDesigns, defenderShipDesigns);

            const {missileAttacks, cannonAttacks, attackerShips, defenderShips} = battleEngine.initialiseShips({ interceptor: 1, cruiser: 1}, { cruiser: 1});

            expect(missileAttacks).toStrictEqual([
                {attack: 1, team: 0, ships:[missileInterceptor]},
                {attack: 1, team: 1, ships:[missileAndCannonCruiser]},
            ]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 1, ships:[missileAndCannonCruiser]},
                {attack: 0, team: 0, ships:[cruiser]}
            ]);
            expect(attackerShips).toStrictEqual([missileInterceptor, cruiser]);
            expect(defenderShips).toStrictEqual([missileAndCannonCruiser]);
        });

        it('different ships with the same initiative should be separated', () => {
            const interceptor = ShipBuilder.interceptor().withInitiative(3).build();
            const cruiser = ShipBuilder.cruiser().withInitiative(3).build();

            const attackerShipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const frequency: Record<string, number> = { interceptor: 1, cruiser: 1};
            const battleEngine = new BattleEngine(attackerShipDesigns, {});

            const {missileAttacks, cannonAttacks, attackerShips, defenderShips} = battleEngine.initialiseShips(frequency, {});

            expect(missileAttacks).toStrictEqual([]);
            expect(cannonAttacks).toStrictEqual([
                {attack: 0, team: 0, ships:[cruiser]},
                {attack: 0, team: 0, ships:[interceptor]}
            ]);
            expect(attackerShips).toStrictEqual([interceptor, cruiser]);
            expect(defenderShips).toStrictEqual([]);
        });
    });

    describe('createAttack', () => {
        it('6 attacks are always valid', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 6;

            const attacks = battleEngine.calculateAttack(0, interceptor, 10);

            expect(attacks).toHaveLength(10);
            expect(attacks[0].value).toBeGreaterThanOrEqual(6)
            expect(attacks[0].strength).toBe(1)
        });

        it('computers modify the hit value of rolls 2-5', () => {
            const interceptor = ShipBuilder.interceptor().withComputers(4).build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 5;

            const attacks = battleEngine.calculateAttack(0, interceptor, 1);

            expect(attacks).toHaveLength(1);
            expect(attacks[0].value).toBe(9)
            expect(attacks[0].strength).toBe(1)
        });

        it('1 attacks are always invalid', () => {
            const interceptor = ShipBuilder.interceptor().withComputers(10).build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 1;

            const attacks = battleEngine.calculateAttack(0, interceptor, 10);

            expect(attacks).toHaveLength(0);
        });

        it('5 attack are not valid without computers', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 5;

            const attacks = battleEngine.calculateAttack(0, interceptor, 10);

            expect(attacks).toHaveLength(0);
        });

        it('5 attack are valid with computers', () => {
            const interceptor = ShipBuilder.interceptor().withComputers(1).build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 5;

            const attacks = battleEngine.calculateAttack(0, interceptor, 10);

            expect(attacks).toHaveLength(10);
        });

        it('base interceptor has 0 missile attacks', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 6;

            const attacks = battleEngine.calculateAttack(1, interceptor, 10);

            expect(attacks).toHaveLength(0);
        });

        it('interceptor with missile attacks', () => {
            const interceptor = ShipBuilder.interceptor().withFluxMissile(1).withPlasmaMissile(1).build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 6;

            const attacks = battleEngine.calculateAttack(1, interceptor, 10);

            expect(attacks).toHaveLength(20);
        });

        it('interceptor with all cannon attacks', () => {
            const interceptor = ShipBuilder.interceptor().withPlasmaCannon(1).withSolitonCannon(1).withAntimatterCannon(1).build();
            const battleEngine = new BattleEngine({}, {});
            battleEngine.rollDie = () => 6;

            const attacks = battleEngine.calculateAttack(0, interceptor, 1);

            expect(attacks).toHaveLength(4);
            expect(attacks[0].strength).toBe(1);
            expect(attacks[1].strength).toBe(2);
            expect(attacks[2].strength).toBe(3);
            expect(attacks[3].strength).toBe(4);
        });
    });

    describe('battle', () => {
        it('defender wins an interceptor battle if it hits', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const shipDesigns: Record<string, Ship> = { interceptor };
            const frequency: Record<string, number> = { interceptor: 1};
            const battleEngine = new BattleEngine(shipDesigns, shipDesigns);
            battleEngine.rollDie = () => 6

            const result = battleEngine.battle(frequency, frequency);

            expect(result).toBe(1);
        });

        it('attacker wins an interceptor battle if 2 vs 1 and always hit', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const shipDesigns: Record<string, Ship> = { interceptor };
            const battleEngine = new BattleEngine(shipDesigns, shipDesigns);
            battleEngine.rollDie = () => 6

            const result = battleEngine.battle({ interceptor: 2}, { interceptor: 1});

            expect(result).toBe(-1);
        });


        it('should stop attack as soon as opponent is gone', () => {
            const interceptor = ShipBuilder.interceptor().build();
            const cruiser = ShipBuilder.cruiser().build();
            const shipDesigns: Record<string, Ship> = {interceptor, cruiser};
            const aShips: Record<string, number> = { interceptor: 0, cruiser: 1, dreadnought: 0, starbase: 0};
            const bShips: Record<string, number> = { interceptor: 2, cruiser: 1, dreadnought: 0, starbase: 0};
            const battleEngine = new BattleEngine(shipDesigns, shipDesigns);
            battleEngine.rollDie = () => 6;

            const result = battleEngine.battle(aShips, bShips);

            expect(result).toBe(1);
        });

    });
});

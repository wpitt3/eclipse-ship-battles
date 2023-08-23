import {Ship, ShipBuilder, SHIPTYPE} from "../ShipBuilder";
import {TypedLocalStorage, TypedNamedLocalStorage} from "../TypedLocalStorage";
import {Faction} from "./FactionForm";

const components = {
    [SHIPTYPE.Interceptor]: [9, 19, 0, 5],
    [SHIPTYPE.Cruiser]: [13, 19, 0, 9, 1, 5],
    [SHIPTYPE.Dreadnought]: [13, 19, 19, 0, 9, 1, 1, 5],
    [SHIPTYPE.Starbase]: [13, 0, 19, 1, 1]
}

const baseStats = {
    [SHIPTYPE.Interceptor]: {initiative: 2, energy: 0},
    [SHIPTYPE.Cruiser]: {initiative: 1, energy: 0},
    [SHIPTYPE.Dreadnought]: {initiative: 0, energy: 0},
    [SHIPTYPE.Starbase]: {initiative: 4, energy: 3}
}

export class FactionManager {
    private readonly factionManager: TypedLocalStorage<Faction>;

    private readonly namesManager: TypedNamedLocalStorage<Array<string>>;

    private readonly NPCs: Record<string, Faction> = {
        'NPCs': { name: "NPCs", ships: {ancient: ShipBuilder.ancient().build(), guardian: ShipBuilder.guardian().build(), gcds: ShipBuilder.gcds().build()}, baseStats, components} as Faction,
        'Advanced NPCs': { name: "Advanced NPCs", ships: {ancient: ShipBuilder.ancient2().build(), guardian: ShipBuilder.guardian2().build(), gcds: ShipBuilder.gcds2().build()}, baseStats, components} as Faction
    }

    constructor() {
        this.factionManager = new TypedLocalStorage<Faction>({name: '', ships: {}, baseStats, components})
        this.namesManager = new TypedNamedLocalStorage<Array<string>>([], 'factionNames')
    }

    create(name: string): void {
        const newFaction = this.createFaction(name)
        this.factionManager.set(name, newFaction);
        this.namesManager.set([...this.namesManager.get(), name]);
    }

    isEditable(name: string): boolean {
        return !Object.keys(this.NPCs).includes(name);
    }

    defendingOnlyFactions(): Array<string> {
        return Object.keys(this.NPCs);
    }

    get(name: string): Faction {
        if (!!this.NPCs[name]) {
            return this.NPCs[name];
        }
        return this.factionManager.get(name);
    }

    getNames(): Array<string> {
        return this.namesManager.get().concat(Object.keys(this.NPCs)) ;
    }

    includes(name:string): boolean {
        return this.namesManager.get().includes(name);
    }

    remove(name: string): void {
        const factionNames = [...this.namesManager.get()];
        const index = factionNames.indexOf(name);
        if (index !== -1) {
            const factionName = this.namesManager.get()[index];
            factionNames.splice(index, 1)
            this.factionManager.remove(factionName);
            this.namesManager.set(factionNames);
        }
    }

    set(name: string, faction: Faction): void {
        this.factionManager.set(name, faction);
    }

    private createFaction(name: string): Faction {
        return {
            name: name,
            ships: {
                interceptor: ShipBuilder.interceptor().build(),
                cruiser: ShipBuilder.cruiser().build(),
                dreadnought: ShipBuilder.dreadnought().build(),
                starbase: ShipBuilder.starbase().build(),
            } as Record<string, Ship>,
            components,
            baseStats
        }
    }
}
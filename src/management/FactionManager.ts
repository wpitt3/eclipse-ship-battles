import {Ship, ShipBuilder} from "../ShipBuilder";
import {TypedLocalStorage, TypedNamedLocalStorage} from "../TypedLocalStorage";
import {Faction} from "./FactionForm";





export class FactionManager {
    private readonly factionManager: TypedLocalStorage<Faction>;

    private readonly namesManager: TypedNamedLocalStorage<Array<string>>;

    readonly NPCs: Record<string, Faction> = {
        'NPCs': { name: "NPCs", ships: {ancient: ShipBuilder.ancient().build(), guardian: ShipBuilder.guardian().build(), gcds: ShipBuilder.gcds().build()}} as Faction,
        'Advanced NPCs': { name: "Advanced NPCs", ships: {ancient: ShipBuilder.ancient2().build(), guardian: ShipBuilder.guardian2().build(), gcds: ShipBuilder.gcds2().build()}} as Faction
    }

    constructor() {
        this.factionManager = new TypedLocalStorage<Faction>({name: '', ships: {}})
        this.namesManager = new TypedNamedLocalStorage<Array<string>>([], 'factionNames')
    }

    create(name: string) {
        const newFaction = this.createFaction(name)
        this.factionManager.set(name, newFaction);
        this.namesManager.set([...this.namesManager.get(), name]);
    }

    isEditable(name: string) {
        return !Object.keys(this.NPCs).includes(name);
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

    remove(name: string) {
        const factionNames = [...this.namesManager.get()];
        const index = factionNames.indexOf(name);
        if (index !== -1) {
            const factionName = this.namesManager.get()[index];
            factionNames.splice(index, 1)
            this.factionManager.remove(factionName);
            this.namesManager.set(factionNames);
        }
    }

    set(name: string, faction: Faction) {
        this.factionManager.set(name, faction);
    }

    setShips(name: string, ships: Record<string, Ship>) {
        const faction = this.factionManager.get(name);
        faction.ships = ships;
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
            } as Record<string, Ship>
        }
    }
}
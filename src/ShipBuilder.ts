
export interface Ship {
    name: string,
    props: ShipProps,
}

export interface ShipProps {
    initiative: number;
    computers: number;
    shields: number;
    hull: number;
    ionCannon: number;
    plasmaCannon: number;
    solitonCannon: number;
    antimatterCannon: number;
    fluxMissile: number;
    plasmaMissile: number;
    solitonMissile: number;
    antimatterMissile: number;
}

export class ShipBuilder {
    private name: string;

    readonly props: ShipProps;

    constructor() {
        this.name = '';
        this.props = {
            initiative: 0,
            computers: 0,
            shields: 0,
            hull: 0,
            ionCannon: 0,
            plasmaCannon: 0,
            solitonCannon: 0,
            antimatterCannon: 0,
            fluxMissile: 0,
            plasmaMissile: 0,
            solitonMissile: 0,
            antimatterMissile: 0,
        };
    }

    static clone(ship: Ship): Ship {
        return {name: ship.name, props: {...ship.props}}
    }

    static ancient(): ShipBuilder {
        return new ShipBuilder().withName("ancient").withInitiative(2).withIonCannon(2).withComputers(1).withHull(1)
    }

    static guardian(): ShipBuilder {
        return new ShipBuilder().withName("guardian").withInitiative(3).withIonCannon(3).withComputers(2).withHull(2)
    }

    static interceptor(): ShipBuilder {
        return new ShipBuilder().withName("interceptor").withInitiative(3).withIonCannon(1)
    }

    static cruiser(): ShipBuilder {
        return new ShipBuilder().withName("cruiser").withInitiative(2).withIonCannon(1).withHull(1).withComputers(1)
    }

    static dreadnought(): ShipBuilder {
        return new ShipBuilder().withName("dreadnought").withInitiative(1).withIonCannon(1)
    }

    static starbase(): ShipBuilder {
        return new ShipBuilder().withName("starbase").withInitiative(4).withIonCannon(1).withComputers(1).withHull(2)
    }

    withName(name: string): ShipBuilder {
        this.name = name;
        return this;
    }

    withInitiative(initiative: number): ShipBuilder {
        this.props.initiative = initiative;
        return this;
    }

    withComputers(computers: number): ShipBuilder {
        this.props.computers = computers;
        return this;
    }

    withShields(shields: number): ShipBuilder {
        this.props.shields = shields;
        return this;
    }

    withHull(hull: number): ShipBuilder {
        this.props.hull = hull;
        return this;
    }

    withIonCannon(ionCannon: number): ShipBuilder {
        this.props.ionCannon = ionCannon;
        return this;
    }

    withPlasmaCannon(plasmaCannon: number): ShipBuilder {
        this.props.plasmaCannon = plasmaCannon;
        return this;
    }

    withSolitonCannon(solitonCannon: number): ShipBuilder {
        this.props.solitonCannon = solitonCannon;
        return this;
    }

    withAntimatterCannon(antimatterCannon: number): ShipBuilder {
        this.props.antimatterCannon = antimatterCannon;
        return this;
    }

    withFluxMissile(fluxMissile: number): ShipBuilder {
        this.props.fluxMissile = fluxMissile;
        return this;
    }

    withPlasmaMissile(plasmaMissile: number): ShipBuilder {
        this.props.plasmaMissile = plasmaMissile;
        return this;
    }

    withSolitonMissile(solitonMissile: number): ShipBuilder {
        this.props.solitonMissile = solitonMissile;
        return this;
    }

    withAntimatterMissile(antimatterMissile: number): ShipBuilder {
        this.props.antimatterMissile = antimatterMissile;
        return this;
    }

    build(): Ship {
        return {
            name: this.name,
            props: this.props,
        };
    }
}

export interface Ship {
    name: string,
    props: ShipProps,
}

export interface ShipProps {
    initiative: number;
    computers: number;
    shields: number;
    hull: number;
    ion_cannon: number;
    plasma_cannon: number;
    soliton_cannon: number;
    antimatter_cannon: number;
    flux_missile: number;
    plasma_missile: number;
}

export class ShipBuilder {
    private name: string;
    private props: ShipProps;

    constructor() {
        this.name = '';
        this.props = {
            initiative: 0,
            computers: 0,
            shields: 0,
            hull: 0,
            ion_cannon: 0,
            plasma_cannon: 0,
            soliton_cannon: 0,
            antimatter_cannon: 0,
            flux_missile: 0,
            plasma_missile: 0,
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
        this.props.ion_cannon = ionCannon;
        return this;
    }

    withPlasmaCannon(plasmaCannon: number): ShipBuilder {
        this.props.plasma_cannon = plasmaCannon;
        return this;
    }

    withSolitonCannon(solitonCannon: number): ShipBuilder {
        this.props.soliton_cannon = solitonCannon;
        return this;
    }

    withAntimatterCannon(antimatterCannon: number): ShipBuilder {
        this.props.antimatter_cannon = antimatterCannon;
        return this;
    }

    withFluxMissile(fluxMissile: number): ShipBuilder {
        this.props.flux_missile = fluxMissile;
        return this;
    }

    withPlasmaMissile(plasmaMissile: number): ShipBuilder {
        this.props.plasma_missile = plasmaMissile;
        return this;
    }

    build(): Ship {
        return {
            name: this.name,
            props: this.props,
        };
    }
}



import {ShipBuilder, ShipProps, SHIPTYPE} from "../ShipBuilder";
import {idToPart} from "./PartDetails";
import {BaseStats} from "./VisualFactionBuilder";

const validate = (shipName: SHIPTYPE, baseStats: BaseStats, components: number[]) => {
    let energy = baseStats.energy;
    let drives = 0;
    components.forEach((partId: number ) => {
        if (partId !== 0) {
            const part = idToPart[partId];
            if (!!part.energyCost) {
                energy -= part.energyCost;
            }
            part.components.forEach((component) => {
                if (component.type === "energy") {
                    energy += component.score;
                }
                if (component.type === "drives") {
                    drives += component.score;
                }
            });
        }
    });
    return energy >= 0 && (shipName === SHIPTYPE.Starbase && drives === 0 || shipName !== SHIPTYPE.Starbase && drives > 0)
}

export const validateFactionComponents = (components: Record<SHIPTYPE, number[]>, baseStats: Record<SHIPTYPE, BaseStats>) => {
    const shipTypes = Object.values(SHIPTYPE).filter((x) => isNaN(Number(x)));
    let valid = true;
    shipTypes.forEach((shipType: SHIPTYPE) => {
       if (!validate(shipType, baseStats[shipType], components[shipType])) {
           valid = false;
       }
    });
    const componentFrequency = Object.values(components).reduce((frequencyTable, numbers) => {
        numbers.forEach(number => {
            frequencyTable[number] = (frequencyTable[number] || 0) + 1;
        });
        return frequencyTable;
    }, {} as Record<number, number>) as Record<number, number>;
    return valid && Object.keys(componentFrequency).filter((key) => parseInt(key) > 24 && componentFrequency[parseInt(key)] > 1).length == 0;
}

export const calculateShipValues = (baseStats: BaseStats, components: number[]): ShipProps => {
    const shipValues: Record<string, number> = {...new ShipBuilder().build().props, ...baseStats}
    const weapons: Record<string, Record<number, string>> = {
        cannons: {1: "ionCannon", 2: "plasmaCannon", 3: "solitonCannon", 4: "antimatterCannon"},
        missiles: {1: "ionMissile", 2: "plasmaMissile", 3: "solitonMissile", 4: "antimatterMissile"}
    }

    components.forEach((partId: number ) => {
        if (partId !== 0) {
            const part = idToPart[partId];
            if (!!part.energyCost) {
                shipValues.energy -= part.energyCost;
            }
            if (!!part.initiative) {
                shipValues.initiative += part.initiative;
            }
            part.components.forEach((component) => {
                if (!weapons[component.type]) {
                    shipValues[component.type] += component.score;
                } else {
                    shipValues[weapons[component.type][component.score]] += 1;
                }
            });
        }
    });

    return shipValues as unknown as ShipProps;
}
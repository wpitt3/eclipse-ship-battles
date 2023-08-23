
const HULLS = "hull";
const DRIVES = "drives";
const ENERGY = "energy";
const COMPUTERS = "computers";
const SHIELDS = "shields";
const CANNONS = "cannons";
const MISSILES = "missiles";
const MORE = "more";

export enum PartSection {
    hull = "hull",
    drives = "drives",
    energy = "energy",
    computers = "computers",
    shields = "shields",
    cannons = "cannons",
    missiles = "missiles",
    more = "more",
}

import energy from '../icons/energy.png';
import hull from '../icons/hull.png';
import drive from '../icons/hex.png';
import comp1 from '../icons/comp1.png';
import comp2 from '../icons/comp2.png';
import comp3 from '../icons/comp3.png';
import shield1 from '../icons/shield1.png';
import shield2 from '../icons/shield2.png';
import shield3 from '../icons/shield3.png';
import ion from '../icons/ion.png';
import plasma from '../icons/plasma.png';
import soliton from '../icons/soliton.png';
import antimatter from '../icons/antimatter.png';
import ion_missile from '../icons/ion-missile.png';
import plasma_missile from '../icons/plasma-missile.png';
import soliton_missile from '../icons/soliton-missile.png';
import antimatter_missile from '../icons/antimatter-missile.png';

export const partSectionToSymbol: Record<PartSection, string> = {
    [HULLS]: hull,
    [DRIVES]: drive,
    [ENERGY]: energy,
    [COMPUTERS]: comp1,
    [SHIELDS]: shield1,
    [CANNONS]: ion,
    [MISSILES]: ion_missile,
    [MORE]: "",
}

export const partSectionToScoreToImage: Record<PartSection, Record<number, string>> = {
    [COMPUTERS]: {1: comp1, 2: comp2, 3: comp3} as Record<number, string>,
    [SHIELDS]: {1: shield1, 2: shield2, 3: shield3} as Record<number, string>,
    [CANNONS]: {1: ion, 2: plasma, 3: soliton, 4: antimatter} as Record<number, string>,
    [MISSILES]: {1: ion_missile, 2: plasma_missile, 3: soliton_missile, 4: antimatter_missile} as Record<number, string>,
    [HULLS]: {},
    [DRIVES]: {},
    [ENERGY]: {},
    [MORE]: {},
}

interface PartComponent {
    type: PartSection;
    score: number;
}

export interface Part {
    components: PartComponent[];
    energyCost?: number;
    initiative?: number;
    id: number;
}

export const partSectionToParts: Record<PartSection, Array<Part>> = {
    [HULLS]: [
        {id: 1, components: [{type: PartSection.hull, score: 1}]},
        {id: 2, components: [{type: PartSection.hull, score: 2}]},
        {id: 3, components: [{type: PartSection.hull, score: 3}], energyCost: 2},
        {id: 4, components: [{type: PartSection.computers, score: 1}, {type: PartSection.hull, score: 1}]},
    ],
    [DRIVES]: [
        {id: 5, components: [{type: PartSection.drives, score: 1}], energyCost: 1, initiative: 1},
        {id: 6, components: [{type: PartSection.drives, score: 2}], energyCost: 2, initiative: 2},
        {id: 7, components: [{type: PartSection.drives, score: 3}], energyCost: 3, initiative: 3},
        {id: 8, components: [{type: PartSection.drives, score: 3}]},
    ],
    [ENERGY]: [
        {id: 9, components: [{type: PartSection.energy, score: 3}]},
        {id: 10, components: [{type: PartSection.energy, score: 6}]},
        {id: 11, components: [{type: PartSection.energy, score: 9}]},
        {id: 12, components: [{type: PartSection.energy, score: 12}]},
    ],
    [COMPUTERS]: [
        {id: 13, components: [{type: PartSection.computers, score: 1}]},
        {id: 14, components: [{type: PartSection.computers, score: 2}], energyCost: 1},
        {id: 15, components: [{type: PartSection.computers, score: 3}], energyCost: 2},
    ],
    [SHIELDS]: [
        {id: 16, components: [{type: PartSection.shields, score: 1}]},
        {id: 17, components: [{type: PartSection.shields, score: 2}], energyCost: 1},
        {id: 18, components: [{type: PartSection.shields, score: 1}, {type: PartSection.energy, score: 4}]},
    ],
    [CANNONS]: [
        {id: 19, components: [{type: PartSection.cannons, score: 1}], energyCost: 1},
        {id: 20, components: [{type: PartSection.cannons, score: 2}], energyCost: 2},
        {id: 21, components: [{type: PartSection.cannons, score: 3}], energyCost: 3},
        {id: 22, components: [{type: PartSection.cannons, score: 4}], energyCost: 4},
    ],
    [MISSILES]: [
        {id: 23, components: [{type: PartSection.missiles, score: 1}, {type: PartSection.missiles, score: 1}], initiative: 1},
        {id: 24, components: [{type: PartSection.missiles, score: 2}, {type: PartSection.missiles, score: 2}], energyCost: 1},
    ],
    [MORE]: [
        {id: 25, components: [{type: PartSection.cannons, score: 1}], initiative: 3},
        {id: 26, components: [{type: PartSection.shields, score: 3}], energyCost: 2, initiative: 1},
        {id: 27, components: [{type: PartSection.cannons, score: 1}, {type: PartSection.cannons, score: 1}]},
        {id: 28, components: [{type: PartSection.drives, score: 4}], initiative: 2, energyCost: 2},
        {id: 29, components: [{type: PartSection.cannons, score: 2}, {type: PartSection.cannons, score: 2}], energyCost: 3},
        {id: 30, components: [{type: PartSection.drives, score: 2}, {type: PartSection.energy, score: 2}]},
        {id: 31, components: [{type: PartSection.cannons, score: 3}], energyCost: 1},
        {id: 32, components: [{type: PartSection.hull, score: 3}]},
        {id: 33, components: [{type: PartSection.missiles, score: 1}, {type: PartSection.missiles, score: 1}, {type: PartSection.missiles, score: 1}]},////
        {id: 34, components: [{type: PartSection.energy, score: 11}]},
        {id: 35, components: [{type: PartSection.computers, score: 2}], initiative: 1},
        {id: 36, components: [{type: PartSection.shields, score: 2}, {type: PartSection.energy, score: 2}]},
        {id: 37, components: [{type: PartSection.missiles, score: 4}], initiative: 1},
        {id: 38, components: [{type: PartSection.missiles, score: 3}]}
    ]
}

export const idToPart: Record<number, Part> = Object.entries(partSectionToParts).reduce((acc, [, parts]) => ({
    ...acc,
    ...parts.reduce((groupAcc, part) => ({ ...groupAcc, [part.id]: part }), {})
}),{});

// muon drive
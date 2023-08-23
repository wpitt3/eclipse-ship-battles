
const HULLS = "hulls";
const DRIVES = "drives";
const ENERGY = "energy";
const COMPUTERS = "computers";
const SHIELDS = "shields";
const CANNONS = "cannons";
const MISSILES = "missiles";
const MORE = "more";

export enum PartSection {
    hulls = "hulls",
    drives = "drives",
    energy = "energy",
    computers = "computers",
    shields = "shields",
    cannons = "cannons",
    missiles = "missiles",
    more = "more",
}

export const partSectionToSymbol: Record<PartSection, string> = {
    [HULLS]: "favorite",
    [DRIVES]: "hexagon",
    [ENERGY]: "bolt",
    [COMPUTERS]: "track_changes",
    [SHIELDS]: "shield",
    [CANNONS]: "brightness_high",
    [MISSILES]: "rocket",
    [MORE]: "more_horiz",
}
export interface Part {
    partSectionA: PartSection;
    partScoreA: number;
    partSectionB?: PartSection;
    partScoreB?: number;
    energyCost?: number;
    initiative?: number;
}

export const partSectionToParts: Record<PartSection, Array<Part>> = {
    [HULLS]: [
        {partSectionA: PartSection.hulls, partScoreA: 1},
        {partSectionA: PartSection.hulls, partScoreA: 2},
        {partSectionA: PartSection.hulls, partScoreA: 3, energyCost: 2},
        {partSectionA: PartSection.computers, partScoreA: 1, partSectionB: PartSection.hulls, partScoreB: 1}
    ],
    [DRIVES]: [
        {partSectionA: PartSection.drives, partScoreA: 1, energyCost: 1, initiative: 1},
        {partSectionA: PartSection.drives, partScoreA: 2, energyCost: 2, initiative: 2},
        {partSectionA: PartSection.drives, partScoreA: 3, energyCost: 3, initiative: 3},
        {partSectionA: PartSection.drives, partScoreA: 3},
    ],
    [ENERGY]: [
        {partSectionA: PartSection.energy, partScoreA: 3},
        {partSectionA: PartSection.energy, partScoreA: 6},
        {partSectionA: PartSection.energy, partScoreA: 9},
        {partSectionA: PartSection.energy, partScoreA: 12},
    ],
    [COMPUTERS]: [
        {partSectionA: PartSection.computers, partScoreA: 1},
        {partSectionA: PartSection.computers, partScoreA: 2, energyCost: 1},
        {partSectionA: PartSection.computers, partScoreA: 3, energyCost: 2},
    ],
    [SHIELDS]: [
        {partSectionA: PartSection.shields, partScoreA: 1},
        {partSectionA: PartSection.shields, partScoreA: 2, energyCost: 1},
        {partSectionA: PartSection.shields, partScoreA: 1, partSectionB: PartSection.energy, partScoreB: 4},
    ],
    [CANNONS]: [
        {partSectionA: PartSection.cannons, partScoreA: 1, energyCost: 1},
        {partSectionA: PartSection.cannons, partScoreA: 2, energyCost: 2},
        {partSectionA: PartSection.cannons, partScoreA: 3, energyCost: 3},
        {partSectionA: PartSection.cannons, partScoreA: 4, energyCost: 4},
    ],
    [MISSILES]: [
        {partSectionA: PartSection.missiles, partScoreA: 1, partSectionB: PartSection.missiles, partScoreB: 1, initiative: 1},
        {partSectionA: PartSection.missiles, partScoreA: 2, partSectionB: PartSection.missiles, partScoreB: 2, energyCost: 1}
    ],
    [MORE]: [
        {partSectionA: PartSection.cannons, partScoreA: 1, initiative: 3},//
        {partSectionA: PartSection.shields, partScoreA: 1},
        {partSectionA: PartSection.cannons, partScoreA: 1, partSectionB: PartSection.cannons, partScoreB: 1},
        {partSectionA: PartSection.drives, partScoreA: 2, initiative: 2},
        {partSectionA: PartSection.cannons, partScoreA: 2, partSectionB: PartSection.cannons, partScoreB: 2, energyCost: 3},
        {partSectionA: PartSection.drives, partScoreA: 2, initiative: 2},
        {partSectionA: PartSection.cannons, partScoreA: 3, energyCost: 2},
        {partSectionA: PartSection.hulls, partScoreA: 3},
        {partSectionA: PartSection.missiles, partScoreA: 1, partSectionB: PartSection.missiles, partScoreB: 1},
        {partSectionA: PartSection.energy, partScoreA: 11}, //
        {partSectionA: PartSection.computers, partScoreA: 3, initiative: 1},
        {partSectionA: PartSection.shields, partScoreA: 3},
        {partSectionA: PartSection.missiles, partScoreA: 4},//
        {partSectionA: PartSection.missiles, partScoreA: 3, initiative: 1}, //
    ]
}
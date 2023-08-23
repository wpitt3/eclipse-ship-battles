import React, {useState} from 'react';
import "./PartSelector.css";
import {Part, PartSection, partSectionToParts, partSectionToSymbol} from "./PartDetails";


interface FactionParams {
    onSelected: () => number;
    onCancel: () => void;
}

function PartSelector({onSelected, onCancel}: FactionParams) {
    const [section, setSection] = useState<PartSection>();

    const partSections = Object.values(PartSection).filter((x) => isNaN(Number(x)));
    const parts: Array<Part> = section ? partSectionToParts[section] : []
    console.log(section);

    return (
        <div className="part-selector-wrapper">
            { !!section || partSections.map((value, i) => {
                return (
                    <div key={i} className={"part-selector-block part-selector-category-"+value} onClick={ () => setSection(String(value) as PartSection)} >
                        <i className="material-icons">{partSectionToSymbol[value]}</i>
                    </div>
                );
            })}
            { !!section || <div key={partSections.length} className={"part-selector-block" } onClick={() => onCancel()}><i className="material-icons">close</i></div> }
            { !section ||  parts.map((value, i) => {
                return (
                    <div key={i} className={"part-selector-block part-selector-part " + (!!value.partSectionB ? "part-selector-double-part ": "")} >
                        {!value.initiative || <div className={"part-selector-initiative"}>{[...Array(value.initiative)].map(() => <i className="material-icons">expand_less</i>)}</div>}
                        { value.partSectionA === PartSection.missiles ? <div className={"part-selector-missiles"}><i className="material-icons">rocket</i></div> : ""}
                        { value.partSectionA === PartSection.cannons ? <div className={"part-selector-part-cannon part-selector-part-cannon-" + value.partScoreA}>{[...Array(value.partScoreA)].map((_,index) => <i className={"material-icons cannon-icon-"+index}>brightness_high</i>)}</div>: <div className={"part-a"}><div className="part-value">{value.partScoreA}</div> <i className="material-icons">{partSectionToSymbol[value.partSectionA]}</i></div> }
                        {!value.partSectionB || <div className={"part-b"}><div className="part-value">{value.partScoreB}</div> <i className="material-icons">{partSectionToSymbol[value.partSectionB]}</i></div>}
                        {!value.energyCost || <div className={"part-selector-energy"}><div>{value.energyCost}</div><i className="material-icons">bolt</i></div>}
                    </div>
                );
            })}
            { !section || <div key={parts.length} className={"part-selector-block" } onClick={() => setSection(undefined)}><i className="material-icons">close</i></div> }
        </div>
    );
}

export default PartSelector;

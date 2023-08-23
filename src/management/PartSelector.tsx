import React, {useState} from 'react';
import "./PartSelector.css";
import {Part, PartSection, partSectionToParts, partSectionToSymbol} from "./PartDetails";
import PartBlock from "./PartBlock";


interface Params {
    onSelected: () => number;
    onCancel: () => void;
}

function PartSelector({onSelected, onCancel}: Params) {
    const [section, setSection] = useState<PartSection>();

    const partSections = Object.values(PartSection).filter((x) => isNaN(Number(x)));
    const parts: Array<Part> = section ? partSectionToParts[section] : []

    return (
        <div className="part-selector-wrapper">
            { !!section || partSections.map((value, i) => {
                return (
                    <div key={i} className={"part-selector-block part-selector-category-"+value} onClick={ () => setSection(String(value) as PartSection)} >
                        { value === PartSection.more ? <i className="material-icons">more_horiz</i> : <img src={partSectionToSymbol[value]} />}
                    </div>
                );
            })}
            { !!section || <div key={partSections.length} className={"part-selector-block" } onClick={() => onCancel()}><i className="material-icons">close</i></div> }
            { !section ||  parts.map((part, i) => {
                return <PartBlock key={i} onSelected={() => onSelected()} part={part} unique={section === PartSection.more}/>
            })}
            { !section || <div key={parts.length} className={"part-selector-block" } onClick={() => setSection(undefined)}><i className="material-icons">close</i></div> }
        </div>
    );
}

export default PartSelector;

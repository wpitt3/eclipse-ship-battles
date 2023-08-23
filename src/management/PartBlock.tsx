import React from 'react';
import "./PartSelector.css";
import {Part, PartSection, partSectionToScoreToImage, partSectionToSymbol} from "./PartDetails";
import init from '../icons/init.png';
import energy from '../icons/energy.png';


interface Params {
    onSelected?: () => void;
    part: Part;
    unique: boolean
}

function PartBlock({onSelected, part, unique}: Params) {

    return (
        <div className={"part-block part-block-components-" + part.components.length + (unique ? " part-block-unique": "")} onClick={onSelected}>
            {!part.initiative || <div className={"part-block-initiative"}>{[...Array(part.initiative)].map((_, i) => <img key={i} src={init} />)}</div>}
            {!part.energyCost || <div className={"part-block-energy"}><div>{part.energyCost}</div><img src={energy} /></div>}
            { part.components[0].type === PartSection.missiles && <div className={"part-block-missiles"}><img src={partSectionToScoreToImage[PartSection.missiles][part.components[0].score]}/></div> }
            {part.components.map((component, ci) => {
                const multipleImagesForType = Object.keys(partSectionToScoreToImage[component.type]).length !== 0;
                const typeForImage = component.type === PartSection.missiles ? PartSection.cannons : component.type
                const image = multipleImagesForType ? partSectionToScoreToImage[typeForImage][component.score] : partSectionToSymbol[typeForImage];
                return (
                    <div key={ci} className={"part-block-component part-block-component-" + ci + (!multipleImagesForType ? " part-block-with-score" : "")}>
                        { !multipleImagesForType && <div className="part-block-score">{component.score}</div>}
                        <img src={image}/>
                    </div>
                )
            })}
        </div>
    );
}

export default PartBlock;

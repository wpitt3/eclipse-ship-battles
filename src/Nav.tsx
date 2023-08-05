import React, {useState} from 'react';

function Nav( {page, setPage}: {
    setPage: (page:string) => void;
    page: string,
}) {
    return (
        <div>
            <button onClick={() => setPage('build')} >Build</button>
            <button onClick={() => setPage('battle')} >Battle</button>
        </div>
    );
}

export default Nav;

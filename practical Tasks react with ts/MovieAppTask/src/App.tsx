import React, { Suspense,lazy } from "react";
import ReactDOM from 'react-dom/client';
const Home=lazy(()=>import('./Home'))



const App=()=>{
    return (
        <>
        <div>
            <Suspense fallback={<div>Loading....</div>}>
                <Home/>
            </Suspense>
        </div>
        </>
    )
}

export default App;
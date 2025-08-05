import React, { useState } from "react";
import BuyActionsWindow from "./BuyActionsWindow";
import { GeneralContext } from "./GeneralContext";

function GeneralContent({ children }) {
    const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");

    const handleOpenBuyWindow = (uid) => {
        console.log("Opening buy window for:", uid);
        setIsBuyWindowOpen(true);
        setSelectedStockUID(uid);
    };

    const handleCloseBuyWindow = () => {
        console.log("Closing buy window");
        setIsBuyWindowOpen(false);
        setSelectedStockUID("");
    };

    return (
        <GeneralContext.Provider
            value={{
                openBuyWindow: handleOpenBuyWindow,
                closeBuyWindow: handleCloseBuyWindow,
            }}
        >
            {children}
            {isBuyWindowOpen && <BuyActionsWindow uid={selectedStockUID} />}
        </GeneralContext.Provider>
    );
}

export default GeneralContent;
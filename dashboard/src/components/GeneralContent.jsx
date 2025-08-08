import React, { useState } from "react";
import BuyActionsWindow from "./BuyActionsWindow";
import { GeneralContext } from "./GeneralContext";

function GeneralContent({ children }) {
    const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");

    const handleOpenBuyWindow = (uid) => {
        setIsBuyWindowOpen(true);
        setSelectedStockUID(uid);
    };

    const handleCloseBuyWindow = () => {
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
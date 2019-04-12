/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCommodity(trade) {
    trade.commodity.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Commodity');

    //emit a notification that a trade has occured
    let tradeNotification = getFactory().newEvent('org.example.mynetwork', 'TradeNotification');

    tradeNotification.commodity = trade.commodity;
    emit(tradeNotification);

    
    await assetRegistry.update(trade.commodity);
}

/**
 * Remove all high volume commodities
 * @param {org.example.mynetwork.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 */

async function RemoveHighQuantityCommodities(remove) {
    
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Commodity');

    //selectCommoditiesWithHighQuantity - this query is defined in queries.qry
    let result =  query('selectCommoditiesWithHighQuantity');

    for(let i=0; i < result.length; i++) {
        let trade = result[i];

        //emit a event that the trade has removed
        let removeNotification = getFactory().newEvent('org.example.mynetwork','RemoveNotification');
        //assign trade to the removeNotification.commodity
        removeNotification.commodity = trade;
        //emit an event with removeNotification as param
        emit(removeNotification);
        //remove the trade from the assetRegistry
        await assetRegistry.remove(trade);
    }
}
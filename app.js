const apiURL = 'https://api.coinmarketcap.com/v1/ticker/?convert=INR&limit=15';
const main = document.getElementsByTagName('main')[0];

window.addEventListener('load', (e) => {
    updateCurryency();

    if('serviceWorker' in navigator){
        try{
            navigator.serviceWorker.register('sw.js');
            console.log('Service worker registered');
        }catch (err){
            console.log('Service worker registration failed.');
        }
    }

});

async function updateCurryency() {
    const res = await fetch(apiURL);
    const data = await res.json();

    data.forEach((v) => {
        v.price_inr = parseFloat(v.price_inr).toFixed(2);
        v.hour_class_name = v.percent_change_1h.indexOf('-') > -1 ? 'negative' : 'positive';
        v.daily_class_name = v.percent_change_24h.indexOf('-') > -1 ? 'negative' : 'positive';
        v.seven_day_class_name = v.percent_change_7d.indexOf('-') > -1 ? 'negative' : 'positive';
    });

    main.innerHTML = data.map(createTile).join('\n');
}


function createTile(v) {
    return `<div class="tile">
                <div class="child">
                    <div>
                        <span class="symbol">${v.symbol}</span>
                        <span class="name"> | ${v.name}</span>
                    </div>
                    <div class="currency">
                        ${v.price_inr} &#x20B9;
                    </div>
                </div>
                <div class="child">
                    <div class="change">
                        <span class="unit">1h:</span>
                        <span class="value ${v.hour_class_name}">${v.percent_change_1h}&#37;</span>
                    </div>
                    <div class="change">
                        <span class="unit">24h:</span>
                        <span class="value ${v.daily_class_name}">${v.percent_change_24h}&#37;</span>
                    </div>
                    <div class="change">
                        <span class="unit">7d:</span>
                        <span class="value ${v.seven_day_class_name}">${v.percent_change_7d}&#37;</span>
                    </div>
                </div>
            </div>`;
}

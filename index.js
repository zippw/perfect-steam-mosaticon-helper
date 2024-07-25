const fs = require('node:fs');
const path = require('node:path');
const db = require('./emotes.json');
const open = require("openurl").open;

class EmoticonsManager {
    constructor() {
        // if(fs.readFileSync(path.join(__dirname, "emotes.json"))) console.log(true)
        // generate fake inventory for steam.tools/mozation fetch
        // this.generateInventory(emote => emote.price <= 0.03).then(c => console.log(c));

        // check if you have enough emoticons to make perfect art
        // this.analyzeArt(require('./real_inv.json')).then(e => {

        /* OPEN STEAM MARKET LINKS OF MISSING EMOTICONS */
        // e.links.forEach(link => open(link)) 

        // console.log(`Emoticons in art: ${e.all_emotes.length}. ${e.req_emotes.length} are missing from the inventory.`);
        // });


    }

    /**
     * generates fake user inventory from full database (emotes.json)
     * @param {function} filter - Optional filter function to apply on each emote. Defaults to identity function.
     * @param {number} max - Optional maximum number of emotes to include in the inventory. Defaults to Infinity.
     * 
     * @returns {Promise<number>} - Written emotes count
    */
    async generateInventory(filter = emote => emote, max = Infinity) {
        let inventory = { "descriptions": [] };
        db
            .filter(filter)
            .slice(0, max)
            .forEach(emote =>
                inventory.descriptions.push({ name: emote.name }));

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, "inv_gen.json"), JSON.stringify(inventory), (err) => {
                if (err) reject(err);
                resolve(inventory.descriptions.length)
            })
        });
    }

    /**
     * @typedef {Object} res
     * @property {string[]} all_emotes - Emotes used in art.
     * @property {string[]} inv_emotes - Emotes from inventory.
     * @property {string[]} req_emotes - Missing emotes.
     * @property {string[]} links - Missing emotes links to steam market.
     */
    /**
     * analyzes mozaticon art
     * @param {string} inventory - Inventory data.
     * 
     * @return {res}
    */
    async analyzeArt(inventory) {
        const export_txt = fs.readFileSync(path.join(__dirname, "export.txt")).toString("utf-8"),
            all_emotes = [... new Set(export_txt.match(/:\w+:/gm))],
            inv_emotes = inventory.descriptions.map(x => x.name),
            req_emotes = all_emotes.filter(re => !inv_emotes.includes(re))

        return {
            all_emotes, inv_emotes, req_emotes,
            links: req_emotes.map(x => `https://steamcommunity.com/market/listings/${db.find(e => e.name === x).url}`)
        };
    }
}

new EmoticonsManager();
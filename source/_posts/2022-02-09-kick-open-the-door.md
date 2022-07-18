---
title: Kick Open The Door
author: nathan
type: post
date: 2022-02-09T19:33:05+00:00
url: /kick-open-the-door/
comments: true
categories:
  - Games
tags:
  - Games
---

If you browse [reddit][1] and you're into gaming, check out [r/kickopenthedoor][2].

<!--more-->

This game features a unique mechanic where you interact by posting commands as comments on reddit posts. A bot takes your commands and posts a reply. All the redditors !attack boss posts and try to be the one who kills him. The game is enhanced by joining their discord server where you can partake in raids to kill the bosses.

You should check it out.
{% raw %}

<link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type="text/css">
<script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>
<style>
        @media only screen and (max-width: 400px) {
            #damage, #raid-times {
                margin: 1rem 0;
                width: 100%;
            }
        }
        @media only screen and (min-width: 401px) {
            #damage, #raid-times {
                margin: 1rem;
            }
        }
        #damage-wrapper {
            overflow-x: auto;
        }
        #damage, #raid-times {
            display: inline-block;
            color: #777;
            background: #ddd;
            -webkit-box-shadow: 0 -1px 4px #ccc inset;
            box-shadow: 0 -1px 4px #ccc inset;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 3px;
        }
        div#damage table td,
        div#damage table th {
            padding: 0.3em;
        }
        div#damage table thead tr {
            background: #dfffd278;
        }
        div#damage table tr:nth-child(even) {
            background: #eee;
        }
        #raid-times div.attack-time:nth-child(even) {
            background: #eee;
        }
        #raid-times div.attack-time.skipped {
            color: rgb(190 145 1);
        }
        #raid-times div.attack-time.sniper {
            color: rgb(235 97 125);
        }
        #raid-times div.attack-time.kill {
            background: rgba(170, 238, 170, 0.5);
        }
        #raid-times div.attack-time.dupe {
            background: rgba(238, 238, 170, 0.5);
        }
        #raid-times div.attack-time.late {
            background: rgba(238, 170, 170, 0.5);
        }
        #raid-times div.attack-time:nth-child(even).dupe {
            background: rgba(238, 238, 170, 0.75);
        }
        #raid-times div.attack-time:nth-child(even).late {
            background: rgba(238, 170, 170, 0.75);
        }
        .damage-data, .damage-info, .damage-normal, .damage-crit, .damage-extra, .damage-total {
            display: flex;
            flex-direction: row;
        }
        .damage-info, .damage-normal, .damage-crit, .damage-extra, .damage-total {
            flex-wrap: wrap;
        }
        .damage-info-row {
            padding: .75em;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        .damage-info-row >span.label {
            font-weight: bold;
        }
        .damage-info-row >span {
            min-width: 2em;
            text-align: center;
        }
        .damage-info .damage-info-row >span {
            padding: .5em;
        }
        .damage-data {
            flex-wrap: nowrap;
        }
        .damage-data .damage-info-row {
            flex: 1;
        }
        .damage-normal, .damage-crit, .damage-extra, .damage-total {
            margin-left: 1em;
            flex: 1;
        }
        .damage-data .damage-info-row >span {
            flex: 1;
        }
        #item-damage-display-close {
            cursor: pointer;
            margin-right: 1em;
            float: right;
            display: inline;
        }
        #item-damage-display-close:before {
            content: '✖';
        }
        div.item-damage-display {
            overflow-x: auto;
            background: #eee;
            border-radius: 2px;
            min-height: 150px;
            position: relative;
            box-shadow: 0 19px 38px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
            display: block;
        }
        .item-damage-display h3 {
            background: rgb(108 108 108 / 39%);
            padding: 1em;
            margin: 0;
        }
        .damage-weak, .damage-neutral, .damage-resist {
            padding: 1em;
            flex: 1;
        }
        .damage-weak {
            background: #94c19482;
        }
        .damage-resist {
            background: #d1a5a587;
        }
        #damage-table a {
            cursor: pointer;
        }
</style>
<script>
        const DamageModel = {};
        DamageModel.showItemData = (id) => {
            if(isNaN(Number(id))) {
                const possible = DamageModel.items.find(x => x.name === id);
                if (!possible) {
                    return;
                }
                id = possible.id;
            }
            const holder = document.getElementById('item-damage-wrapper');
            const item = DamageModel.items.find(x => x.id === id);
            const damageItem = DamageModel.damage.byId[id];
            holder.innerHTML = DamageModel.itemInfoTemplate({item, damage: damageItem});
            setTimeout(() => {
                const dd = document.getElementById('item-damage-display-close');
                dd.onclick = e => {
                    const clean = document.getElementById('item-damage-wrapper');
                    while(clean.firstChild){
                        clean.removeChild(clean.firstChild);
                    }
                };
            }, 250);
        }
        function Round(amount) {
            if (isNaN(Number(amount))) {
                return 0;
            }
            return Math.round(amount*100)/100;
        }
        window.addEventListener('DOMContentLoaded', () => {
            async function fetchJson(uri) {
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                return data;
            }
            async function loadDamage() {
                const asyncDamage = fetchJson('https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/weapon-damage.json');
                const asyncItems = fetchJson('https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/item-master.json');
                DamageModel.damage = await asyncDamage;
                DamageModel.items = await asyncItems;
                const template = document.getElementById('item-damage-template').innerHTML;
                DamageModel.itemInfoTemplate = Handlebars.compile(template);
                const dataTable = new simpleDatatables.DataTable("#damage-table", {
                    searchable: true,
                    fixedHeight: true,
                    perPageSelect: [10, 25, 50, 100, 200],
                    columns: [
                        {select: 0, render: (data, cell, row) => `<a onclick="DamageModel.showItemData(${data})">${data}</a>`},
                        {select: 1, render: (data, cell, row) => `<a onclick="DamageModel.showItemData('${data}')">${data}</a>`}
                    ]
                });
                function createDamageRow(itemDamage, item) {
                    const totalHits = (itemDamage.weak?.total?.hits || 0) + (itemDamage.neutral?.total?.hits || 0) + (itemDamage.resist?.total?.hits || 0);
                    const critHits = (itemDamage.weak?.crit?.hits || 0) + (itemDamage.neutral?.crit?.hits || 0) + (itemDamage.resist?.crit?.hits || 0);
                    const critPercent = totalHits && critHits ? (critHits / totalHits) : 0;
                    const row = [
                        item.id + '', 
                        item.name,
                        item.element,
                        (item.damage || '') + '',
                        (itemDamage.weak?.normal?.averageDamage || '') + '',
                        (itemDamage.weak?.normal?.low || '') + '',
                        (itemDamage.weak?.normal?.high || '') + '',
                        (itemDamage.weak?.extra?.averageDamage || '') + '',
                        (itemDamage.weak?.crit?.averageDamage || '') + '',
                        totalHits + '',
                        Round(critPercent * 100) + ''
                    ];
                    return row;
                }
                function createDamageRowByAmount(damageAmount, itemDamages) {
                    const totalHits = itemDamages.reduce((p, itemDamage) => p + 
                     (itemDamage.weak?.total?.hits || 0) + (itemDamage.neutral?.total?.hits || 0) + (itemDamage.resist?.total?.hits || 0), 0);
                    const critTotalHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.crit?.hits || 0) + (itemDamage.neutral?.crit?.hits || 0) + (itemDamage.resist?.crit?.hits || 0), 0);
                    const critPercent = totalHits && critTotalHits ? (critTotalHits / totalHits) : 0;
                    const weakTotal = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.normal?.totalDamage || 0), 0);
                    const weakHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.normal?.hits || 0), 0);
                    const low = itemDamages.reduce((p, itemDamage) => (p > 0) && itemDamage.weak?.normal?.low && (p < itemDamage.weak?.normal?.low) ? p : itemDamage.weak?.normal?.low ? itemDamage.weak?.normal?.low : p, 0);
                    const high = itemDamages.reduce((p, itemDamage) => itemDamage.weak?.normal?.high && (p > itemDamage.weak?.normal?.high) ? p : itemDamage.weak?.normal?.high ? itemDamage.weak?.normal?.high : p, 0);
                    const extraTotal = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.extra?.totalDamage || 0), 0);
                    const critTotal = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.crit?.totalDamage || 0), 0);
                    const extraHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.extra?.hits || 0), 0);
                    const critHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.weak?.crit?.hits || 0), 0);
                    const neutralTotal = itemDamages.reduce((p, itemDamage) => p + (itemDamage.neutral?.normal?.totalDamage || 0), 0);
                    const neutralHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.neutral?.normal?.hits || 0), 0);
                    const resistTotal = itemDamages.reduce((p, itemDamage) => p + (itemDamage.resist?.normal?.totalDamage || 0), 0);
                    const resistHits = itemDamages.reduce((p, itemDamage) => p + (itemDamage.resist?.normal?.hits || 0), 0);
                    const nlow = itemDamages.reduce((p, itemDamage) => (p > 0) && itemDamage.neutral?.normal?.low && (p < itemDamage.neutral?.normal?.low) ? p : itemDamage.neutral?.normal?.low ? itemDamage.neutral?.normal?.low : p, 0);
                    const nhigh = itemDamages.reduce((p, itemDamage) => itemDamage.neutral?.normal?.high && (p > itemDamage.neutral?.normal?.high) ? p : itemDamage.neutral?.normal?.high ? itemDamage.neutral?.normal?.high : p, 0);
                    const rlow = itemDamages.reduce((p, itemDamage) => (p > 0) && itemDamage.resist?.normal?.low && (p < itemDamage.resist?.normal?.low) ? p : itemDamage.resist?.normal?.low ? itemDamage.resist?.normal?.low : p, 0);
                    const rhigh = itemDamages.reduce((p, itemDamage) => itemDamage.resist?.normal?.high && (p > itemDamage.resist?.normal?.high) ? p : itemDamage.resist?.normal?.high ? itemDamage.resist?.normal?.high : p, 0);
                    const row = [
                        (damageAmount || '') + '',
                        `${weakHits ? Round(weakTotal/weakHits) + '' : ''} (${low}, ${high})`,
                        `${neutralHits ? Round(neutralTotal/neutralHits) + '' : ''} (${nlow}, ${nhigh})`,
                        `${resistHits ? Round(resistTotal/resistHits) + '' : ''} (${rlow}, ${rhigh})`,
                        extraHits ? Round(extraTotal / extraHits) + '' : '',
                        critHits ? Round(critTotal / critHits) + '' : '',
                        totalHits + '',
                        Round(critPercent * 100) + ''
                    ];
                    return row;
                }
                function fixAverage(itemDamage) {
                    for (const areaKey in itemDamage) {
                        for (const subKey in itemDamage[areaKey]) {
                            if (itemDamage[areaKey][subKey].averageDamage) {
                                itemDamage[areaKey][subKey].averageDamage = Round(itemDamage[areaKey][subKey].averageDamage);
                            }
                        }
                    }
                }
                const perItemData = {
                    data: []
                };
                for (const key in DamageModel.damage.byId) {
                    const itemDamage = DamageModel.damage.byId[key];
                    const item = DamageModel.items.find(x => x.id == key);
                    if (itemDamage && item) {
                        fixAverage(itemDamage)
                        perItemData.data.push(createDamageRow(itemDamage, item));
                    }
                }
                dataTable.insert(perItemData);
                const byAmountData = {
                    data: []
                };
                for (let i = 1; i < 100; i++) {
                    const items = DamageModel.items.filter(x => x.damage == i);
                    if (!items?.length) {
                        continue;
                    }
                    const itemDamages = items.map(x => DamageModel.damage.byId[x.id]).filter(x => !!x);
                    if (itemDamages?.length) {
                        byAmountData.data.push(createDamageRowByAmount(i, itemDamages));
                    }
                }
                const dataTable2 = new simpleDatatables.DataTable("#damage-amount-table", {
                    searchable: true,
                    fixedHeight: true,
                    perPage: 20,
                    perPageSelect: [10, 20, 50]
                });
                dataTable2.insert(byAmountData);
            }
            loadDamage().catch(error => console.error(error));
            function processRaid(raidData, race) {
                let raidStartTimeout = Number(document.getElementById('raid-start-timeout').value);
                if (isNaN(raidStartTimeout) || !raidStartTimeout || raidStartTimeout < 0) {
                    raidStartTimeout = 5;
                }
                const resultsDiv = document.getElementById('raid-time-results');
                while(resultsDiv.firstChild){
                    resultsDiv.removeChild(resultsDiv.firstChild);
                }
                function findAttacks(commentsArray) {
                    const matches = [];
                    for (const comment of commentsArray) {
                        if (comment.body?.match(/!attack/i)) {
                            matches.push(comment);
                        }
                        if (comment.replies?.data?.children?.length) {
                            matches.push(...findAttacks(comment.replies.data.children.map(x => x.data)));
                        }
                    }
                    return matches;
                }
                const attacks = findAttacks(raidData[1].data.children.map(x => x.data));
                const killingAttack = attacks.find(x => x?.replies?.data?.children?.find(y => y?.data?.body?.includes('**(KILL!)**') && y?.data?.author === 'KickOpenTheDoorBot'));
                if (!killingAttack) {
                    resultsDiv.innerText = 'No kill found';
                    return;
                }
                const killTag = document.createElement('h4');
                killTag.innerText = `Killed by ${killingAttack.author} (${killingAttack.author_flair_text}) at ${killingAttack.created}`;
                resultsDiv.append(killTag);
                const killingAttackTime = killingAttack.created;
                const minRaidStartTime = killingAttackTime - raidStartTimeout;
                const maxRaidEndTime = killingAttackTime + raidStartTimeout;
                const raidAttacks = attacks.filter(x => x?.created >= minRaidStartTime && x?.created <= maxRaidEndTime && x?.author_flair_text?.includes(race) && x?.body.match(/!attack/i)).sort((a, b) => a.created - b.created);
                if (!raidAttacks?.length) {
                    return;
                }
                let raidStart = 0;
                let lastAttack = 0;
                for (const attack of raidAttacks) {
                    if (attack.created > lastAttack + raidStartTimeout && attack.created <= killingAttackTime) {
                        raidStart = attack.created;
                    }
                    lastAttack = attack.created;
                }
                killTag.innerText += ` (${killingAttackTime - raidStart})`;
                const seen = [];
                let firstDupe = undefined;
                let isDead = false;
                attacks.filter(x => x.created >= raidStart && (x.created <= lastAttack || x.created <= killingAttackTime))
                        .sort((a, b) => b.created - a.created)
                        .reverse()
                        .map(x => {
                    const div = document.createElement('div');
                    div.className = 'attack-time';
                    const isSniper = !x.author_flair_text?.includes(race);
                    if (x === killingAttack) {
                        isDead = true;
                        div.classList.add('kill');
                        seen.push(x.author);
                    } else if (!isSniper) {
                        if (seen.includes(x.author) && x !== killingAttack) {
                            firstDupe = x;
                            div.classList.add('dupe');
                        } else if (firstDupe && firstDupe !== x) {
                            div.classList.add('late');
                        } else {
                            seen.push(x.author);
                        }
                    }
                    if (isSniper) {
                        div.classList.add('sniper');
                    }
                    div.innerText = `${x.author} : ${x.created - raidStart}`;
                    const botReply = !x.replies?.data?.children?.length ? undefined : x.replies.data.children.map(x => x.data).find(x => x.author === 'KickOpenTheDoorBot');
                    if ((!botReply || botReply.body.includes('Sorry, this boss is already dead'))
                        && !isDead) {
                            div.innerText += ' *';
                            div.classList.add('skipped');
                        }
                    resultsDiv.append(div);
                });
            }
            async function loadRaidResults() {
                const raidIdInput = document.getElementById('raid-id');
                let raidId = raidIdInput.value;
                if (!raidId) return;
                const urlParts = raidId.split('/');
                if (urlParts.length > 1) {
                    if (urlParts.length === 4) {
                        raidId = urlParts[3];
                    } else if (urlParts.length >= 7) {
                        raidId = urlParts[6];
                    } else {
                        raidId = '';
                    }
                    raidIdInput.value = raidId;
                    if (!raidId) return;
                }
                const url = `https://www.reddit.com/r/KickOpenTheDoor/${raidId}.json?raw_json=1`;
                const raidData = await fetchJson(url);
                const race = document.getElementById('raid-race').value;
                processRaid(raidData, race);
            }
            document.getElementById('load-raid').onclick = (ev) => loadRaidResults().catch(error => console.error(error));
        });
</script>
<article id="raid-times">
    <h3>Raid Times</h3>
    <div id="raid-time-inputs">
        <input id="raid-id" />
        <select id="raid-race">
            <option selected>Orc</option>
            <option>Elf</option>
            <option>Dwarf</option>
            <option>Halfling</option>
        </select>
        <input id="raid-start-timeout" value="5" width="3" />
        <button type="button" role="button" id="load-raid">Load</button>
    </div>
    <div id="raid-time-results"></div>
</article>
<article id="damage-wrapper">
        <div id="damage">
            <h3>Damage</h3>
            <div id="item-damage-wrapper"></div>
            <h4>By Weapon</h4>
            <table id="damage-table">
                <thead>
                    <tr>
                        <th data-sortable="true" data-type="number">ID</th>
                        <th data-sortable="true" data-type="string">Name</th>
                        <th data-sortable="true" data-type="string">Elelment</th>
                        <th data-sortable="true" data-type="number" title="Damage">Damage</th>
                        <th data-sortable="true" data-type="number" title="Weak Average">Weak</th>
                        <th data-sortable="true" data-type="number" title="Weak Low">Low</th>
                        <th data-sortable="true" data-type="number" title="Weak High">High</th>
                        <th data-sortable="true" data-type="number" title="Weak Extra Average">Extra</th>
                        <th data-sortable="true" data-type="number" title="Weak Crit Average">Crit</th>
                        <th data-sortable="false" data-type="number">Hits</th>
                        <th data-sortable="false" data-type="number">Crit%</th>
                    </tr>
                </thead>
            </table>
            <h4>By Damage</h4>
            <table id="damage-amount-table">
                <thead>
                    <tr>
                    <th data-sortable="true" data-type="number" title="Damage">Damage</th>
                    <th data-sortable="true" data-type="string" title="Weak Average (Low, High)">Weak</th>
                    <th data-sortable="true" data-type="string" title="Neutral Average (Low, High)">Neutral</th>
                    <th data-sortable="true" data-type="string" title="Resist Average (Low, High)">Resist</th>
                    <th data-sortable="true" data-type="number" title="Weak Extra Average">Extra</th>
                    <th data-sortable="true" data-type="number" title="Weak Crit Average">Crit</th>
                    <th data-sortable="false" data-type="number">Hits</th>
                    <th data-sortable="false" data-type="number">Crit%</th>
                    </tr>
                </thead>
            </table>
        </div>
</article>
<script id="item-damage-template" type="text/x-handlebars-template">
        <div class="item-damage-display">
            <h3>{{item.id}}: {{item.name}} <span id="item-damage-display-close"></span></h3>
            <div class="item-damage-details">
                <div class="damage-info">
                    <div class="damage-info-row">
                        <span class="label">Element</span><span class="data">{{item.element}}</span>
                    </div>
                    <div class="damage-info-row">
                        <span class="label">Damage</span><span class="data">{{item.damage}}</span>
                    </div>
                    <div class="damage-info-row">
                        <span class="label">Durability</span><span class="data">{{item.durability}}</span>
                    </div>
                    <div class="damage-info-row">
                        <span class="label">Price</span><span class="data">{{item.price}}</span>
                    </div>
                </div>
                <div class="damage-data">
                    <div class="damage-weak">
                        {{#if damage.weak}}
                        <span class="label">Weak</span>
                        <div class="damage-normal">
                            {{#if damage.weak.normal}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.weak.normal.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.weak.normal.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.weak.normal.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.weak.normal.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-crit">
                            <span class="label">Crit</span>
                            {{#if damage.weak.crit}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.weak.crit.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.weak.crit.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.weak.crit.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.weak.crit.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-extra">
                            <span class="label">Extra</span>
                            {{#if damage.weak.extra}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.weak.extra.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.weak.extra.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.weak.extra.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.weak.extra.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-total">
                            <span class="label">Total</span>
                            {{#if damage.weak.total}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.weak.total.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.weak.total.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.weak.total.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.weak.total.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        {{/if}}
                    </div>
                    <div class="damage-neutral">
                        {{#if damage.neutral}}
                        <span class="label">Neutral</span>
                        <div class="damage-normal">
                            {{#if damage.neutral.normal}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.neutral.normal.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.neutral.normal.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.neutral.normal.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.neutral.normal.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-crit">
                            <span class="label">Crit</span>
                            {{#if damage.neutral.crit}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.neutral.crit.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.neutral.crit.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.neutral.crit.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.neutral.crit.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-extra">
                            <span class="label">Extra</span>
                            {{#if damage.neutral.extra}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.neutral.extra.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.neutral.extra.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.neutral.extra.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.neutral.extra.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-total">
                            <span class="label">Total</span>
                            {{#if damage.neutral.total}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.neutral.total.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.neutral.total.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.neutral.total.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.neutral.total.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        {{/if}}
                    </div>
                    <div class="damage-resist">
                        {{#if damage.resist}}
                        <span class="label">Resist</span>
                        <div class="damage-normal">
                            {{#if damage.resist.normal}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.resist.normal.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.resist.normal.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.resist.normal.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.resist.normal.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-crit">
                            <span class="label">Crit</span>
                            {{#if damage.resist.crit}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.resist.crit.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.resist.crit.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.resist.crit.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.resist.crit.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-extra">
                            <span class="label">Extra</span>
                            {{#if damage.resist.extra}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.resist.extra.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.resist.extra.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.resist.extra.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.resist.extra.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        <div class="damage-total">
                            <span class="label">Total</span>
                            {{#if damage.resist.total}}
                            <div class="damage-info-row">
                                <span class="label">Low</span><span class="data">{{damage.resist.total.low}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Avg</span><span class="data">{{damage.resist.total.averageDamage}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">High</span><span class="data">{{damage.resist.total.high}}</span>
                            </div>
                            <div class="damage-info-row">
                                <span class="label">Hits</span><span class="data">{{damage.resist.total.hits}}</span>
                            </div>
                            {{/if}}
                        </div>
                        {{/if}}
                    </div>
                </div>
            </div>
        </div>
</script>
{% endraw %}

[1]: https://www.reddit.com
[2]: https://www.reddit.com/r/kickopenthedoor

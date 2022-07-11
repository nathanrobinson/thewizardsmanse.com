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

<link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type="text/css">
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" type="text/javascript"></script>
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
        #raid-times div.attack-time.kill {
            background: rgba(170, 238, 170, 0.251);
        }
        #raid-times div.attack-time.dupe {
            background: rgba(238, 238, 170, 0.251);
        }
        #raid-times div.attack-time.late {
            background: rgba(238, 170, 170, 0.251);
        }
        #raid-times div.attack-time:nth-child(even).dupe {
            background: rgba(238, 238, 170, 0.343);
        }
        #raid-times div.attack-time:nth-child(even).late {
            background: rgba(238, 170, 170, 0.343);
        }
    </style>
    <script>
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
                const damage = await fetchJson('https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/weapon-damage.json');
                const items = await fetchJson('https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/item-master.json');
                const dataTable = new simpleDatatables.DataTable("#damage-table", {
                    searchable: true,
                    fixedHeight: true,
                    perPageSelect: [10, 25, 50, 100, 200]
                });
                function Round(amount) {
                    if (isNaN(Number(amount))) {
                        return 0;
                    }
                    return Math.round(amount*100)/100;
                }
                function createDamageRow(itemDamage, item) {
                    const totalHits = (itemDamage.weak?.total?.hits || 0) + (itemDamage.neutral?.total?.hits || 0) + (itemDamage.resist?.total?.hits || 0);
                    const critHits = (itemDamage.weak?.crit?.hits || 0) + (itemDamage.neutral?.crit?.hits || 0) + (itemDamage.resist?.crit?.hits || 0);
                    const critPercent = totalHits && critHits ? (critHits / totalHits) : 0;
                    const row = [
                        item.id + '', 
                        item.name,
                        Round(itemDamage.weak?.normal?.averageDamage) + '',
                        Round(itemDamage.neutral?.normal?.averageDamage) + '',
                        Round(itemDamage.resist?.normal?.averageDamage) + '',
                        Round(itemDamage.weak?.extra?.averageDamage) + '',
                        Round(itemDamage.neutral?.extra?.averageDamage) + '',
                        Round(itemDamage.resist?.extra?.averageDamage) + '',
                        Round(itemDamage.weak?.crit?.averageDamage) + '',
                        Round(itemDamage.neutral?.crit?.averageDamage) + '',
                        Round(itemDamage.resist?.crit?.averageDamage) + '',
                        totalHits + '',
                        Round(critPercent * 100) + ''
                    ];
                    return row;
                }
                let newData = {
                    data: []
                };
                for (const key in damage.byId) {
                    const itemDamage = damage.byId[key];
                    const item = items.find(x => x.id == key);
                    if (itemDamage && item) {
                        newData.data.push(createDamageRow(itemDamage, item));
                    }
                }
                dataTable.insert(newData);
            }
            loadDamage().catch(error => console.error(error));
            function processRaid(raidData, race) {
                const resultsDiv = document.getElementById('raid-time-results');
                resultsDiv.innerHtml = '';
                const attacks = raidData[1].data.children.map(x => x.data);
                const killingAttack = attacks.find(x => x?.replies?.data?.children?.find(y => y?.data?.body?.includes('**(KILL!)**') && y?.data?.author === 'KickOpenTheDoorBot'));
                if (!killingAttack) {
                    resultsDiv.innerText = 'No kill found';
                    return;
                }
                const killTag = document.createElement('h4');
                killTag.innerText = `Killed by ${killingAttack.author} (${killingAttack.author_flair_text}) at ${killingAttack.created}`;
                resultsDiv.append(killTag);
                const killingAttackTime = killingAttack.created;
                const minRaidStartTime = killingAttackTime - 15;
                const maxRaidEndTime = killingAttackTime + 15;
                const raidAttacks = attacks.filter(x => x?.created >= minRaidStartTime && x?.created <= maxRaidEndTime && x?.author_flair_text?.includes(race) && x?.body.match(/!attack/i)).sort((a, b) => a.created - b.created);
                if (!raidAttacks?.length) {
                    return;
                }
                let raidStart = 0;
                let lastAttack = 0;
                for (const attack of raidAttacks) {
                    if (attack.created > lastAttack + 5 && attack.created <= killingAttackTime) {
                        raidStart = attack.created;
                    }
                    lastAttack = attack.created;
                }
                killTag.innerText += ` (${killingAttackTime - raidStart})`;
                const seen = [];
                let firstDupe = undefined;
                raidAttacks.map(x => {
                    const div = document.createElement('div');
                    div.className = 'attack-time';
                    if (x === killingAttack) {
                        div.classList.add('kill');
                    }
                    if (seen.includes(x.author) && x !== killingAttack) {
                        firstDupe = x;
                        div.classList.add('dupe');
                    } else if (firstDupe && firstDupe !== x) {
                        div.classList.add('late');
                    } else {
                        seen.push(x.author);
                    }
                    div.innerText = `${x.author} : ${x.created - raidStart}`;
                    resultsDiv.append(div);
                });
            }
            async function loadRaidResults() {
                const raidId = document.getElementById('raid-id').value;
                if (!raidId) return;
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
            <button type="button" role="button" id="load-raid">Load</button>
        </div>
        <div id="raid-time-results"></div>
    </article>
    <article id="damage-wrapper">
        <div id="damage">
            <h3>Weapon Damage</h3>
            <table id="damage-table">
                <thead>
                    <th data-sortable="true" data-type="number">ID</th>
                    <th data-sortable="true" data-type="string">Name</th>
                    <th data-sortable="false" data-type="number">Weak</th>
                    <th data-sortable="false" data-type="number">Neutral</th>
                    <th data-sortable="false" data-type="number">Resist</th>
                    <th data-sortable="false" data-type="number">Weak-Extra</th>
                    <th data-sortable="false" data-type="number">Neutral-Extra</th>
                    <th data-sortable="false" data-type="number">Resist-Extra</th>
                    <th data-sortable="false" data-type="number">Weak-Crit</th>
                    <th data-sortable="false" data-type="number">Neutral-Crit</th>
                    <th data-sortable="false" data-type="number">Resist-Crit</th>
                    <th data-sortable="false" data-type="number">Hits</th>
                    <th data-sortable="false" data-type="number">Crit%</th>
                </thead>
            </table>
        </div>
    </article>

[1]: https://www.reddit.com
[2]: https://www.reddit.com/r/kickopenthedoor

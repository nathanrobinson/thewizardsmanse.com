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
<link href="/static/kotd.css" rel="stylesheet" type="text/css">
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
<script src="/static/kotd.js"></script>
{% endraw %}

[1]: https://www.reddit.com
[2]: https://www.reddit.com/r/kickopenthedoor

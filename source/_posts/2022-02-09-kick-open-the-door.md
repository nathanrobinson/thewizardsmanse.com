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

Here are the current bosses:
<span id="last-update"></span>
<div id="boss-list"></div>


And here is what is in the shop until:
<span id="shop-expires"></span>

<div id="shop-info"></div>

 [1]: https://www.reddit.com
 [2]: https://www.reddit.com/r/kickopenthedoor

<style>
    div#boss-list {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
    }
    .boss-info {
        background: #fff;
        border-radius: 2px;
        display: inline-block;
        min-height: 150px;
        margin: 1rem;
        position: relative;
        width: 300px;
        box-shadow: 0 19px 38px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
        flex: none;
    }
    .boss-attributes {
        display: flex;
    }
    .boss-attributes span {
        display: block;
        width: 100%;
        padding: 5px;
        margin: 3px;
        border-radius: 5px;
        color: black;
    }
    .boss-attributes span.weak {
        background: #9c9;
    }
    .boss-attributes span.neutral {
        background: #dddcdc;
    }
    .boss-attributes span.resist {
        background: #d98b8b;
    }
    span.element {
        padding: 0 0.2em;
    }
    span.element:before {
        font-size: 1.2em;
        padding-right: 0.15em;
        margin-left: -0.5em;
        text-decoration: none;
        color: #ccc;
        font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", Times, Symbola, Aegyptus, Code2000, Code2001, Code2002, Musica, serif, LastResort;
        font-variant-emoji: emoji;
    }
    span.element.Havoc:before {
        content: '⚔'
    }
    span.element.Almighty:before {
        content: '👼'
    }
    span.element.Sinful:before {
        content: '😈'
    }
    span.element.Bless:before {
        content: '✝'
    }
    span.element.Curse:before {
        content: '☠'
    }
    span.element.Lawful:before {
        content: '🏛'
    }
    span.element.Order:before {
        content: '☯'
    }
    span.element.Chaos:before {
        content: '🗯'
    }
    span.element.Light:before {
        content: '☀'
    }
    span.element.Dark:before {
        content: '🌌'
    }
    .boss-info .header {
        background: #6091de;
        padding: 8px;
    }
    .boss-info .header a {
        display: block;
        color: white;
        text-align: center;
    }
    .boss-info .header a .hp {
        display: block;
    }
    .boss-content {
        padding: 8px 16px 16px 16px;
    }
</style>

<script>
    window.addEventListener('DOMContentLoaded', () => $.getJSON('https://firebasestorage.googleapis.com/v0/b/thewizardsmanse-8e843.appspot.com/o/kotd.json?alt=media', data => {
        const lastUpdate = $('#last-update');
        lastUpdate.text(new Date(data.generated));

        const bossList = $('#boss-list');
        data.posts.forEach(boss => {
            const bossInfo = $('<div class="boss-info"></div>');
            const totalHP = boss.title.match(/\[Health:([0-9]+)\]/)[1];
            const title = boss.title.replace(/\[Health:[0-9]+\]/, '');
            const remainingHP = boss.link_flair_text.match(/\[Health: ([0-9]+)\]/)[1];
            bossInfo.append(`<div class="header"><a href="https://www.reddit.com${boss.permalink}">${title}<span class="hp">[Health: ${remainingHP} / ${totalHP}]</span></a></div>`);
            const bossContent = $(`<div class="boss-content"><a href="https://www.reddit.com${boss.permalink}"><img src="${boss.thumbnail}"></img></a></div>`);
            const bossAttributes = $('<div class="boss-attributes"></div>');
            const weak = $('<span class="weak"></span>');
            boss.weak.forEach(x => weak.append(`<span class="element ${x}">${x}</span>`));
            bossAttributes.append(weak);
            const neutral = $('<span class="neutral"></span>');
            boss.neutral.forEach(x => neutral.append(`<span class="element ${x}">${x}</span>`));
            bossAttributes.append(neutral);
            const resist = $('<span class="resist"></span>');
            boss.resist.forEach(x => resist.append(`<span class="element ${x}">${x}</span>`));
            bossAttributes.append(resist);
            bossContent.append(bossAttributes);
            bossInfo.append(bossContent)
            bossList.append(bossInfo);
        });

        const shopExpires = $('#shop-expires');
        shopExpires.text(new Date(data.shop.expires * 1000));

        const shopTable = $('<table><tr><th>Id</th><th>Name</th><th>Price</th><th>Damage</th><th>Duration</th><th>Element</th></tr></table>');
        data.shop.items.forEach(item => {
            const row = $(`<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td><td>${item.damage}</td><td>${item.duration}</td><td><span class="element ${item.element}">${item.element}</span></td></tr>`);
            shopTable.append(row);
        });
        const shop = $('#shop-info');
        shop.append(shopTable);
    }));
</script>

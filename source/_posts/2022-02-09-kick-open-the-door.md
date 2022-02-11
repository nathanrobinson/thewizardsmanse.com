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
    .boss-info .header {
        background: #6091de;
        padding: 8px;
    }
    .boss-info .header a {
        color: white;
    }
    .boss-content {
        padding: 8px 16px 16px 16px;
    }
    .boss-content .hp {
        padding: 5px;
        margin: 5px;
        text-align: center;
    }
</style>

<script>
    window.addEventListener('DOMContentLoaded', () => $.getJSON('https://firebasestorage.googleapis.com/v0/b/thewizardsmanse-8e843.appspot.com/o/kotd.json?alt=media', data => {
        const bossList = $('#boss-list');
        const lastUpdate = $('#last-update');
        data.forEach(boss => {
            const bossInfo = $('<div class="boss-info"></div>');
            bossInfo.append(`<div class="header"><a href="https://www.reddit.com${boss.permalink}">${boss.title}</a></div>`);
            const bossContent = $(`<div class="boss-content"><a href="https://www.reddit.com${boss.permalink}"><img src="${boss.thumbnail}"></img></a></div>`);
            const totalHP = boss.title.match(/\[Health:([0-9]+)\]/)[1];
            const remainingHP = boss.link_flair_text.match(/\[Health: ([0-9]+)\]/)[1];
            bossContent.append(`<div class="hp">${remainingHP} / ${totalHP}</div>`)
            const bossAttributes = $('<div class="boss-attributes"></div>');
            const weak = $(`<span class="weak">${boss.weak.join(', ')}</span>`);
            bossAttributes.append(weak);
            const neutral = $(`<span class="neutral">${boss.neutral.join(', ')}</span>`);
            bossAttributes.append(neutral);
            const resist = $(`<span class="resist">${boss.resist.join(', ')}</span>`);
            bossAttributes.append(resist);
            bossContent.append(bossAttributes);
            bossInfo.append(bossContent)
            bossList.append(bossInfo);
            lastUpdate.text(new Date(boss.generated));
        });
    }));
</script>
const DamageModel = {};

DamageModel.showItemData = (id) => {
  if (isNaN(Number(id))) {
    const possible = DamageModel.items.find((x) => x.name === id);
    if (!possible) {
      return;
    }
    id = possible.id;
  }
  const holder = document.getElementById("item-damage-wrapper");
  const item = DamageModel.items.find((x) => x.id === id);
  const damageItem = DamageModel.damage.byId[id];
  holder.innerHTML = DamageModel.itemInfoTemplate({ item, damage: damageItem });
  setTimeout(() => {
    const dd = document.getElementById("item-damage-display-close");
    dd.onclick = (e) => {
      const clean = document.getElementById("item-damage-wrapper");
      while (clean.firstChild) {
        clean.removeChild(clean.firstChild);
      }
    };
  }, 250);
};

function Round(amount) {
  if (isNaN(Number(amount))) {
    return 0;
  }
  return Math.round(amount * 100) / 100;
}

window.addEventListener("DOMContentLoaded", () => {
  async function fetchJson(uri) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  }

  async function loadDamage() {
    const asyncDamage = fetchJson(
      "https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/weapon-damage.json"
    );
    const asyncItems = fetchJson(
      "https://storage.googleapis.com/thewizardsmanse-8e843.appspot.com/item-master.json"
    );
    DamageModel.damage = await asyncDamage;
    DamageModel.items = await asyncItems;

    const template = document.getElementById("item-damage-template").innerHTML;
    DamageModel.itemInfoTemplate = Handlebars.compile(template);

    const dataTable = new simpleDatatables.DataTable("#damage-table", {
      searchable: true,
      fixedHeight: true,
      perPageSelect: [10, 25, 50, 100, 200],
      columns: [
        {
          select: 0,
          render: (data, cell, row) =>
            `<a onclick="DamageModel.showItemData(${data})">${data}</a>`,
        },
        {
          select: 1,
          render: (data, cell, row) =>
            `<a onclick="DamageModel.showItemData('${data}')">${data}</a>`,
        },
      ],
    });

    function createDamageRow(itemDamage, item) {
      const totalHits =
        (itemDamage.weak?.total?.hits || 0) +
        (itemDamage.neutral?.total?.hits || 0) +
        (itemDamage.resist?.total?.hits || 0);
      const critHits =
        (itemDamage.weak?.crit?.hits || 0) +
        (itemDamage.neutral?.crit?.hits || 0) +
        (itemDamage.resist?.crit?.hits || 0);
      const critPercent = totalHits && critHits ? critHits / totalHits : 0;

      const row = [
        item.id + "",
        item.name,
        item.element,
        (item.damage || "") + "",
        (itemDamage.weak?.normal?.averageDamage || "") + "",
        (itemDamage.weak?.normal?.low || "") + "",
        (itemDamage.weak?.normal?.high || "") + "",
        (itemDamage.weak?.extra?.averageDamage || "") + "",
        (itemDamage.weak?.crit?.averageDamage || "") + "",
        totalHits + "",
        Round(critPercent * 100) + "",
      ];
      return row;
    }

    function createDamageRowByAmount(damageAmount, itemDamages) {
      const totalHits = itemDamages.reduce(
        (p, itemDamage) =>
          p +
          (itemDamage.weak?.total?.hits || 0) +
          (itemDamage.neutral?.total?.hits || 0) +
          (itemDamage.resist?.total?.hits || 0),
        0
      );
      const critTotalHits = itemDamages.reduce(
        (p, itemDamage) =>
          p +
          (itemDamage.weak?.crit?.hits || 0) +
          (itemDamage.neutral?.crit?.hits || 0) +
          (itemDamage.resist?.crit?.hits || 0),
        0
      );
      const critPercent =
        totalHits && critTotalHits ? critTotalHits / totalHits : 0;
      const weakTotal = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.normal?.totalDamage || 0),
        0
      );
      const weakHits = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.normal?.hits || 0),
        0
      );
      const low = itemDamages.reduce(
        (p, itemDamage) =>
          p > 0 &&
          itemDamage.weak?.normal?.low &&
          p < itemDamage.weak?.normal?.low
            ? p
            : itemDamage.weak?.normal?.low
            ? itemDamage.weak?.normal?.low
            : p,
        0
      );
      const high = itemDamages.reduce(
        (p, itemDamage) =>
          itemDamage.weak?.normal?.high && p > itemDamage.weak?.normal?.high
            ? p
            : itemDamage.weak?.normal?.high
            ? itemDamage.weak?.normal?.high
            : p,
        0
      );
      const extraTotal = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.extra?.totalDamage || 0),
        0
      );
      const critTotal = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.crit?.totalDamage || 0),
        0
      );
      const extraHits = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.extra?.hits || 0),
        0
      );
      const critHits = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.weak?.crit?.hits || 0),
        0
      );
      const neutralTotal = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.neutral?.normal?.totalDamage || 0),
        0
      );
      const neutralHits = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.neutral?.normal?.hits || 0),
        0
      );
      const resistTotal = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.resist?.normal?.totalDamage || 0),
        0
      );
      const resistHits = itemDamages.reduce(
        (p, itemDamage) => p + (itemDamage.resist?.normal?.hits || 0),
        0
      );
      const nlow = itemDamages.reduce(
        (p, itemDamage) =>
          p > 0 &&
          itemDamage.neutral?.normal?.low &&
          p < itemDamage.neutral?.normal?.low
            ? p
            : itemDamage.neutral?.normal?.low
            ? itemDamage.neutral?.normal?.low
            : p,
        0
      );
      const nhigh = itemDamages.reduce(
        (p, itemDamage) =>
          itemDamage.neutral?.normal?.high &&
          p > itemDamage.neutral?.normal?.high
            ? p
            : itemDamage.neutral?.normal?.high
            ? itemDamage.neutral?.normal?.high
            : p,
        0
      );
      const rlow = itemDamages.reduce(
        (p, itemDamage) =>
          p > 0 &&
          itemDamage.resist?.normal?.low &&
          p < itemDamage.resist?.normal?.low
            ? p
            : itemDamage.resist?.normal?.low
            ? itemDamage.resist?.normal?.low
            : p,
        0
      );
      const rhigh = itemDamages.reduce(
        (p, itemDamage) =>
          itemDamage.resist?.normal?.high && p > itemDamage.resist?.normal?.high
            ? p
            : itemDamage.resist?.normal?.high
            ? itemDamage.resist?.normal?.high
            : p,
        0
      );

      const row = [
        (damageAmount || "") + "",
        `${weakHits ? Round(weakTotal / weakHits) + "" : ""} (${low}, ${high})`,
        `${
          neutralHits ? Round(neutralTotal / neutralHits) + "" : ""
        } (${nlow}, ${nhigh})`,
        `${
          resistHits ? Round(resistTotal / resistHits) + "" : ""
        } (${rlow}, ${rhigh})`,
        extraHits ? Round(extraTotal / extraHits) + "" : "",
        critHits ? Round(critTotal / critHits) + "" : "",
        totalHits + "",
        Round(critPercent * 100) + "",
      ];
      return row;
    }

    function fixAverage(itemDamage) {
      for (const areaKey in itemDamage) {
        for (const subKey in itemDamage[areaKey]) {
          if (itemDamage[areaKey][subKey].averageDamage) {
            itemDamage[areaKey][subKey].averageDamage = Round(
              itemDamage[areaKey][subKey].averageDamage
            );
          }
        }
      }
    }

    const perItemData = {
      data: [],
    };

    for (const key in DamageModel.damage.byId) {
      const itemDamage = DamageModel.damage.byId[key];
      const item = DamageModel.items.find((x) => x.id == key);
      if (itemDamage && item) {
        fixAverage(itemDamage);
        perItemData.data.push(createDamageRow(itemDamage, item));
      }
    }
    dataTable.insert(perItemData);

    const byAmountData = {
      data: [],
    };
    for (let i = 1; i < 100; i++) {
      const items = DamageModel.items.filter((x) => x.damage == i);
      if (!items?.length) {
        continue;
      }
      const itemDamages = items
        .map((x) => DamageModel.damage.byId[x.id])
        .filter((x) => !!x);
      if (itemDamages?.length) {
        byAmountData.data.push(createDamageRowByAmount(i, itemDamages));
      }
    }
    const dataTable2 = new simpleDatatables.DataTable("#damage-amount-table", {
      searchable: true,
      fixedHeight: true,
      perPage: 20,
      perPageSelect: [10, 20, 50],
    });
    dataTable2.insert(byAmountData);
  }
  loadDamage().catch((error) => console.error(error));

  function processRaid(raidData, race) {
    let raidStartTimeout = Number(
      document.getElementById("raid-start-timeout").value
    );
    if (isNaN(raidStartTimeout) || !raidStartTimeout || raidStartTimeout < 0) {
      raidStartTimeout = 5;
    }
    const resultsDiv = document.getElementById("raid-time-results");
    while (resultsDiv.firstChild) {
      resultsDiv.removeChild(resultsDiv.firstChild);
    }

    function findAttacks(commentsArray) {
      const matches = [];
      for (const comment of commentsArray) {
        let isAttack = false;
        if (comment.body?.match(/!attack/i)) {
          matches.push(comment);
          isAttack = true;
        }
        if (comment.replies?.data?.children?.length) {
          if (
            !isAttack &&
            comment.replies.data.children.find((x) =>
              x.data?.body?.includes("Damage | XP | Gold")
            )
          ) {
            matches.push(comment);
          }
          matches.push(
            ...findAttacks(comment.replies.data.children.map((x) => x.data))
          );
        }
      }
      return matches;
    }

    const attacks = findAttacks(raidData[1].data.children.map((x) => x.data));

    const killingAttack = attacks.find((x) =>
      x?.replies?.data?.children?.find(
        (y) =>
          y?.data?.body?.includes("**(KILL!)**") &&
          y?.data?.author === "KickOpenTheDoorBot"
      )
    );

    if (!killingAttack) {
      resultsDiv.innerText = "No kill found";
      return;
    }

    const killTag = document.createElement("h4");
    killTag.innerText = `Killed by ${killingAttack.author} (${killingAttack.author_flair_text}) at ${killingAttack.created}`;
    resultsDiv.append(killTag);

    const killingAttackTime = killingAttack.created;
    const minRaidStartTime = killingAttackTime - 3 * raidStartTimeout;
    const maxRaidEndTime = killingAttackTime + raidStartTimeout;

    let raidStart = minRaidStartTime;
    let lastAttack = maxRaidEndTime;

    const raidAttacks = attacks
      .filter(
        (x) =>
          x?.created >= minRaidStartTime &&
          x?.created <= maxRaidEndTime &&
          (x?.author_flair_text?.includes(race) || race === "None") &&
          x?.body.match(/!attack/i)
      )
      .sort((a, b) => a.created - b.created);

    if (!raidAttacks?.length) {
      return;
    }

    lastAttack = 0;
    for (const attack of raidAttacks) {
      if (
        attack.created > lastAttack + raidStartTimeout &&
        attack.created <= killingAttackTime
      ) {
        raidStart = attack.created;
      }
      lastAttack = attack.created;
    }

    killTag.innerText += ` (${killingAttackTime - raidStart})`;

    const seen = [];

    let firstDupe = undefined;
    let isDead = false;
    attacks
      .filter(
        (x) =>
          x.created >= raidStart &&
          (x.created <= lastAttack || x.created <= killingAttackTime)
      )
      .sort((a, b) => b.created - a.created)
      .reverse()
      .map((x) => {
        const div = document.createElement("div");
        div.className = "attack-time";

        const raceMatch = x.author_flair_text?.match(/(?<race>[a-z]+)/i);

        const author = document.createElement("span");
        author.classList.add(raceMatch?.groups?.race);
        author.innerText = x.author;
        div.append(author);
        const info = document.createElement("span");
        info.classList.add("info");
        info.innerText = ` : ${x.created - raidStart}s`;
        div.append(info);

        if (!isDead) {
          const botReply = !x.replies?.data?.children?.length
            ? undefined
            : x.replies.data.children
                .map((x) => x.data)
                .find((x) => x.author === "KickOpenTheDoorBot");

          if (
            !botReply ||
            botReply.body.includes("Sorry, this boss is already dead")
          ) {
            div.classList.add("skipped");
          } else if (
            botReply.body.includes("You are trying to attack too quickly!")
          ) {
            const cooldownMatch = botReply?.body.match(
              /Try again in (?<cd>.*) minutes./
            );
            const cdInfo = document.createElement("span");
            cdInfo.classList.add("cool-down");
            cdInfo.innerText = ` {${cooldownMatch?.groups?.cd}}`;
            div.append(cdInfo);
          } else {
            const damageMatch =
              botReply?.body.match(
                /\| (?<damage>\d+)[^|]*\| \d+[^|]*\|[^|]*\|/
              ) || "";
            const elementMatch = botReply?.body.match(
              /You used the item '(?<name>.*)' and did (?<extra>.*) extra (?<element>.*) damage/
            );
            const item = DamageModel.items.find(
              (x) => x.name === elementMatch?.groups?.name
            );
            const isWeak = botReply?.body.includes("(WEAK!)") || false;
            const resists = botReply?.body.includes("(RESIST!)") || false;
            const crit = botReply?.body.includes("(CRIT!)") || false;
            const remaining = botReply?.body.match(
              /The boss has \*\*(?<health>-?\d+)\*\* health remaining!/
            );
            if (item?.id || damageMatch?.groups?.damage) {
              const damageInfo = document.createElement("span");
              damageInfo.classList.add("damage");
              damageInfo.innerText = ` !${item?.id || ""} ${crit ? "*" : ""}${
                isWeak ? "+" : ""
              }${resists ? "-" : ""}${damageMatch?.groups?.damage || ""} [${
                remaining?.groups?.health || ""
              }]`;
              div.append(damageInfo);
            }
          }
        }

        const isSniper =
          race !== "None" && !x.author_flair_text?.includes(race);
        if (x === killingAttack) {
          isDead = true;
          div.classList.add("kill");
          seen.push(x.author);
        } else if (!isSniper) {
          if (seen.includes(x.author) && x !== killingAttack) {
            firstDupe = x;
            div.classList.add("dupe");
          } else if (firstDupe && firstDupe !== x) {
            div.classList.add("late");
          } else {
            seen.push(x.author);
          }
        }
        if (isSniper) {
          div.classList.add("sniper");
        }
        resultsDiv.append(div);
      });
  }

  async function loadRaidResults() {
    const raidIdInput = document.getElementById("raid-id");
    let raidId = raidIdInput.value;
    if (!raidId) return;

    const urlParts = raidId.split("/");
    if (urlParts.length > 1) {
      if (urlParts.length === 4) {
        raidId = urlParts[3];
      } else if (urlParts.length >= 7) {
        raidId = urlParts[6];
      } else {
        raidId = "";
      }
      raidIdInput.value = raidId;
      if (!raidId) return;
    }

    const url = `https://www.reddit.com/r/KickOpenTheDoor/${raidId}.json?raw_json=1`;
    const raidData = await fetchJson(url);

    const race = document.getElementById("raid-race").value;
    processRaid(raidData, race);
  }

  document.getElementById("load-raid").onclick = (ev) =>
    loadRaidResults().catch((error) => console.error(error));
});

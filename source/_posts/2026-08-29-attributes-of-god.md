---
title: Attributes of God
author: nathan
type: post
date: 2026-09-29T19:33:00+00:00
url: /attributes-of-god/
comments: true
categories:
  - Theology
  - Logic
  - Games
tags:
  - Theology
  - Logic
  - Games
---

Here's a handy little tool I built to help people understand god's attributes:

<!--more-->

{% raw %}

  <link rel="stylesheet" href="/static/attributes-shared.css" />
  <link rel="stylesheet" href="/static/attributes-of-god.css" />

<div class="page-shell">

    <main class="card page-card">
      <h2 class="card-title">Please select the properties of God.</h2>

      <span class="section-label">Problem to solve</span>
      <div class="custom-select-wrapper" id="selectWrapper">
        <div class="custom-select-trigger" id="selectTrigger">
          <span id="selectedLabel">Select a problem...</span>
          <div class="arrow"></div>
        </div>
        <div class="custom-options" id="customOptions">
          <!-- Dynamically populated -->
        </div>
      </div>

      <div class="problem-description-box">
        <p id="problemDescription"></p>
      </div>

      <div class="subtitle-box" id="subtitleBox">
        <div class="subtitle-content" id="subtitleContent">
          <p class="subtitle" id="subtitle-text">Select God's attributes to see how He handles this problem...</p>
        </div>
      </div>

      <span class="section-label">Attributes</span>
      <div class="toggle-group">
        <div class="toggle-row">
          <span class="label">All Powerful</span>
          <label class="switch">
            <input type="checkbox" data-id="powerful">
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <span class="label">All Knowing</span>
          <label class="switch">
            <input type="checkbox" data-id="knowing">
            <span class="slider"></span>
          </label>
        </div>

        <div class="toggle-row">
          <span class="label">All Loving</span>
          <label class="switch">
            <input type="checkbox" data-id="loving">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </main>

  </div>

  <script src="/static/attributes-of-god-commentary.js"></script>
  <script src="/static/attributes-of-god.js"></script>

{% endraw %}

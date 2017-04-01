---
title: Automatic Paging with Knockout data-bindings
author: nathan
type: post
date: 2013-09-03T20:55:38+00:00
url: /automatic-paging-with-knockout-data-bindings/
comments: true
categories:
  - Code
  - JavaScript
  - Knockout
tags:
  - JavaScript
  - MVVM
  - knockout.js

---
I&#8217;ve been a heavy user of <a title="Knockout JS" href="http://knockoutjs.com/" target="_blank">Knockout JS</a> and MVVM with JavaScript for over a year and I&#8217;ve found most designs can be achieved with the basic data-bindings. There are two scenarios that I have found which require specialized bindings. The first is a select box with numerous options. The second is a long list of data that doesn&#8217;t fit on a single screen.<!--more-->

I prefer to use the <a title="chosen jQuery plugin" href="http://harvesthq.github.io/chosen/" target="_blank">chosen jQuery plugin</a> to manage unwieldy select boxes. The problem is combining the jQuery plugin with Knockout data-binding. For this I use a <a title="Knockout Binding Extension For Chosen" href="http://www.nuget.org/packages/cb.ko.binding.chosen/" target="_blank">Knockout Binding Extension For Chosen</a>. One caveat on this binding is that it can take a while to bind. If you have multiple select boxes with large amounts of data displaying dynamically, you can notice a significant delay. I ran into this problem when binding to an editable grid. The entire grid would display with the select boxes hidden until the user selects that row for editing. The grid would lag by up to 10 seconds while all the select boxes rendered using the chosen plugin. To speed up the grid I wrapped each select box in a span with an &#8220;if&#8221; binding. This kept the select boxes from rendering until the user actually edited that row. Since only one row&#8217;s worth of select boxes were being rendered instead of all rows, the delay wasn&#8217;t as noticeable.

The long list of data that doesn&#8217;t fit on a single screen is a much different problem. To solve this I wanted a paging solution similar to the <a title="Data Tables plugin" href="https://datatables.net/" target="_blank">data tables plugin for jQuery</a>.

<a title="Data Tables" href="http://screencast.com/t/2ZJlLiT6j" target="_blank"><img class="embeddedObject" alt="" src="http://content.screencast.com/users/NathanJRobinson/folders/Jing/media/a81333be-7527-49b9-a5c4-fd9a26a8a0cb/2013-09-02_1711-thumb.png" width="400" height="162" border="0" /></a>

The important functionality that I wanted were the ability to change the page size, the page links, and of course, the actual paging. Originally, I started out building the paging mechanics directly into my view models, but this created a lot of duplication both in the view model and in the html. My next step was to pull the paging functions out of the view model and put them into a base model that could extend any view model with paging functionality. It turns out the paging functionality is easy to encapsulate; for any paged list, you need to track the current page, the number of items per page, and the total number of items. From there it&#8217;s fairly simple to calculate the items to display on the current page.

<pre class="brush: jscript; title: ; notranslate" title="">self.page = ko.observable(1);

    self.itemsPerPage = ko.observable(10);

    self.totalPages = ko.computed(function () {
                var array = observableArray();
                return Math.ceil(array.length / self.itemsPerPage());
            });

    self.pagedItems = ko.computed(function () {
                var array = observableArray();
                var indexOfFirstItemOnCurrentPage = (((self.page() * 1) - 1) * (self.itemsPerPage() * 1));
                var pageArray = array.slice(indexOfFirstItemOnCurrentPage, indexOfFirstItemOnCurrentPage + (self.itemsPerPage()* 1));
                return pageArray;
            });
</pre>

The problem of repeating the html for the knockout binding isn&#8217;t solved with a view model, though. What I really wanted was a drop-in replacement for the foreach binding that would work on any list and would wrap up all the paging functionality. There is a <a title="SimpleGrid" href="https://github.com/knockout/knockout/tree/gh-pages/examples/resources" target="_blank">SimpleGrid</a> knockout binding that does paging, but it replaces the current html node with its own idea of how your data should be rendered. I wanted to use the inline template that the foreach binding uses so that I could page a table, an un-ordered list, or a bunch of divs. In order to be a true drop-in replacement for foreach, I had to separate out the three elements of the pager: the page size control, the paged items, and the page links. I call my pager binding like so:

<pre class="brush: xml; title: ; notranslate" title="">&lt;div id="testBinding"&gt;
            &lt;div data-bind="pageSizeControl: observableArray, pageSize: pageSize"&gt;&lt;/div&gt;
            &lt;table&gt;
                &lt;thead&gt;
                    &lt;tr&gt;&lt;th&gt;$index&lt;/th&gt;&lt;th&gt;Key&lt;/th&gt;&lt;th&gt;Value&lt;/th&gt;&lt;th&gt;Page Size&lt;/th&gt;&lt;/tr&gt;
                &lt;/thead&gt;
                &lt;tbody data-bind="pagedForeach: observableArray"&gt;
                    &lt;tr&gt;
                        &lt;td data-bind="text: $index"&gt;&lt;/td&gt;
                        &lt;td data-bind="text: key"&gt;&lt;/td&gt;
                        &lt;td data-bind="text: value"&gt;&lt;/td&gt;
                        &lt;td class="parentPageSize" data-bind="text: $parent.pageSize"&gt;&lt;/td&gt;
                    &lt;/tr&gt;
                &lt;/tbody&gt;
            &lt;/table&gt;
            &lt;div data-bind="pageLinks: observableArray"&gt;&lt;/div&gt;
        &lt;/div&gt;
</pre>

I have four bindings that I can choose from which give me detailed control over the paging while also letting me reuse the code in a modular way. 

<pre>pagedForeach: displays the current page of items
    pageLinks: displays the first page, last page, and page number navigation links
    pageSizeControl: displays a select box with four standard page sizes to choose from
    pageSize: lets your view model control the page size directly
</pre>

I checked in the binding to github as <a href="https://github.com/nathanrobinson/knockout.pager" title="knockout.pager" target="_blank">knockout.pager</a>. I then used <a href="http://www.myget.org/" title="myGet" target="_blank">myGet </a>to package the files and upload them to <a href="http://www.nuget.org/packages/knockout.pager/" title="knockout.pager" target="_blank">nuGet</a>. I also built several <a href="https://rawgithub.com/nathanrobinson/knockout.pager/master/tests.html" title="unit tests" target="_blank">unit tests</a>. One thing you may notice is that in my bindings I attach the paging view model to the array. This is because the other bindings can see the same view model. In order to work correctly, the bindings have to interact with the same view model. Rather than calling the foreach binding from my binding, I looked at the knockout source and so that foreach is simply a wrapper for the template binding, so I call the template binding directly. I also used the same method of generating templates for the page links and pager size controls that the SimpleGrid binding used.

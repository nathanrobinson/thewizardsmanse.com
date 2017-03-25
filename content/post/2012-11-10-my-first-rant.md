---
title: My first rant…
author: nathan
type: post
date: 2012-11-10T05:09:05+00:00
url: /my-first-rant/
categories:
  - Code
  - JavaScript
  - Rant
tags:
  - JavaScript
  - Rant

---
A friend sent me a [page about elm][1]. It bemoans the idea of &#8220;Callback Hell&#8221; and purports to resolve the situation with a completely new language for web scripting&#8230; It didn&#8217;t take me long to feel the urge to violently disagree with the premise of the page. The author compares callbacks to &#8220;goto&#8221; statements.
  
<!--more-->


  
A callback is simply a function, anonymous or named, that is passed into another method to be called later. jQuery loves callbacks, but my first exposure to them was in c++.
  
Here&#8217;s an example:

<pre class="brush: jscript; title: ; notranslate" title="">function Method1(callback){
    ...
    callback(someValue);
}

function Method2(myValue){
    ...
}

Method1(Method2);
</pre>

The thing to keep in mind is that modern languages have &#8220;anonymous&#8221; methods, so you wouldn&#8217;t need to declare Method2..

<pre class="brush: jscript; title: ; notranslate" title="">function Method1(callback){
    ...
    callback(someValue);
}

Method1(function(myValue){...});
</pre>

So, what&#8217;s wrong with the stance that callbacks are unreadable?
  
I don&#8217;t know&#8230; just the fact that they aren&#8217;t. Especially the example that he gives:

<pre class="brush: jscript; title: ; notranslate" title="">function getPhoto(tag, handlerCallback) {
    asyncGet(requestTag(tag), function(photoList) {
        asyncGet(requestOneFrom(photoList), function(photoSizes) {
            handlerCallback(sizesToPhoto(photoSizes));
        });
    });
}

getPhoto('tokyo', drawOnScreen);
</pre>

I personally find that much more readable than his alternative:

<pre class="brush: plain; title: ; notranslate" title="">getPhotos = lift sizesToPhoto . send . lift requestOneFrom . send . lift requestTag

(tagInput, tags) = Input.textField "Flickr Instant Search"

scene (w,h) img = flow down [ container w 60 middle tagInput, container w (h - 100) middle img ]

main = lift2 scene Window.dimensions(images (getPhotos (dropRepeats tags)))
</pre>

especially given all the helper methods that he includes&#8230;

I certainly don&#8217;t think that callbacks should be singled out and compared to &#8220;goto&#8221;. Really, any function call is a glorified &#8220;goto&#8221;; they just have pretty curly braces to set them apart.
  
I can&#8217;t help but wonder if &#8220;goto&#8221; would have gotten such a bad wrap if the old text editors would have had shift-F12 support. I, for one, always regret never having the chance to use &#8220;comefrom&#8221;.
  
As anyone who works on enterprise level applications knows, code is messy. Especially when the bosses don&#8217;t care what it looks like, just how quickly you can write it. That&#8217;s why modern IDEs arose, because it&#8217;s easier to build a program to navigate your code for you, than to write code that&#8217;s easier to navigate.
  
So, you can go to great lengths, even writing new languages, to avoid using callbacks, or you could use them in a way that makes them easy to understand.
  
In then end, what really matters to me is that I get to keep my curly braces.

 [1]: http://elm-lang.org/learn/Escape-from-Callback-Hell.elm

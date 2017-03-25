---
title: Fun with knockout.js
author: nathan
type: post
date: 2013-03-04T03:49:19+00:00
url: /fun-with-knockout-js/
categories:
  - Code
  - JavaScript
tags:
  - JavaScript
  - MVVM
  - knockout.js

---
A while ago I started looking into <a title="knockout.js" href="http://knockoutjs.com/" target="_blank">knockout.js</a> for an internal MVC website that I&#8217;m working on. Originally I was trying to solve the problem of a very large DOM that only displays a fraction of itself at any time. Knockout handles this very nicely with it&#8217;s <a title="if binding" href="http://knockoutjs.com/documentation/if-binding.html" target="_blank">if binding</a>. The more I used knockout, however, the more I fell in love with the <a title="MVVM" href="http://en.wikipedia.org/wiki/Model_View_ViewModel" target="_blank">MVVM pattern</a>. In fact, if xaml bindings were as easy as knockout bindings, I wouldn&#8217;t be so hesitant to jump into WPF programming!
  
<!--more-->


  
The power of MVVM is the ability to have your view model handle your logic in code without having the complex interaction with your html DOM that is required by jQuery. As an example, I recreated a jQuery <a href="http://www.datatables.net/" target="_blank">DataTable</a> using only <a href="http://jsfiddle.net/vdrzv/4/" target="_blank">knockout bindings</a>.

One typical need when using MVVM is to take action on the UI when a value is updated. I have two scenarios and four different binding strategies in this <a title="jsFiddle" href="http://jsfiddle.net/W2heu/" target="_blank">example</a>.

In the first two bindings we will validate that the text entered is numeric. If it isn&#8217;t, then an error will be displayed to the user until the entry is corrected. In the last two bindings, the entry will be validated and invalid entries will be immediately replaced with &#8220;0&#8221;.

The first binding will be the most familiar to users of jQuery. When your model is tightly coupled with your UI, you create events that fire when the user interacts with a DOM node and then do some action inside that event. In jQuery, validating user input would look something like this:

<pre class="brush: jscript; title: ; notranslate" title="">$('input').on('change', function(){
    if(isInvalid(this.val()))
        handleInvalidValues(this);
});
</pre>

The equivalent in knockout is:

<pre class="brush: xml; title: ; notranslate" title="">&lt;input type="text" data-bind="value: number1, valueUpdate: 'afterkeydown', event: { change: validateNumber1 }, css: { error : !number1valid() }" /&gt;
</pre>

&nbsp;

<pre class="brush: jscript; title: ; notranslate" title="">self.number1 = ko.observable(0);
 self.number1valid = ko.observable(true);
 self.validateNumber1 = function () {
 self.number1valid(!isNaN(self.number1()));
 };
</pre>

the &#8220;event: { change: validateNumber1 }&#8221; calls the validateNumber1 function on your ViewModel whenever the input is changed.
  
In Test 1 in the <a title="jsFiddle" href="http://jsfiddle.net/W2heu/" target="_blank">example fiddle</a>, the update doesn&#8217;t occur until you leave the textbox. To make better use of the MVVM pattern, you have to stop thinking about the UI controlling the flow of you model and start envisioning the ViewModel controlling the flow of your UI. Knockout will do all the work of updating your ViewModel based on user input and will update you UI based on what your ViewModel does with that input. This makes for some very powerful and simple design even sans jQuery.
  
Compare the performance of Test 1 with Test 2. Test 2 immediately displays an error message when an invalid character is typed and immediately removes the error when the input is corrected. Knockout does all the heavy lifting for us. All we do is define what is valid by using a computed observable function. As soon as our observable is updated, knockout checks the computed observables that are dependent on it and updates the UI if they change. No events need to be fired. No special methods need to be called. And the update is immediate.

<pre class="brush: jscript; title: ; notranslate" title="">self.number2 = ko.observable(0);
    self.number2valid = ko.computed(function () {
        return !isNaN(self.number2());
</pre>

As you can see, the code is much simpler, too.

C# programmers may recognize the third binding style as a property with a backing field.

<pre class="brush: jscript; title: ; notranslate" title="">self._number3 = ko.observable(0);
    self.number3 = ko.computed({
        read: function () {
            return self._number3();
        },
        write: function (value) {
            self._number3(value);
            if (isNaN(value)) self._number3(0);
        },
        owner: self
    });
</pre>

We use the computed to intercept, validate, and possibly modify the incoming value. The odd part about updating the backing field before validating is an artifact of how knockout updates the ui. If we set \_number3 to 0 when the incoming value was invalid (say &#8220;0G&#8221; for example) if \_number3 was already 0, then knockout will not see a need to update the ui. This will leave what the user typed in the text box. To work around this, we set _number3 to whatever the user entered and then if it&#8217;s invalid, we set it to 0, so knockout will immediately update the text box value back to 0.

The final binding monitors the input in a simpler fashion.

<pre class="brush: jscript; title: ; notranslate" title="">self.number4 = ko.observable(0);
    self.number4.subscribe(function () {
        if (isNaN(self.number4())) self.number4(0);
    });
</pre>

Instead of intercepting the value, we subscribe to the observable and validate on any change. We don&#8217;t require an extra backing field, and the code is much simpler. Both Test 3 and Test 4 work equally well, but Test 4 is simpler to understand and code. 

While all 4 examples work, Test 1 is too dependent on the ui bindings to be a good implementation of MVVM. If you don&#8217;t add the event binding to call your validation function, then none of your validation will happen. The method used in Test 2 is simpler to understand and more reliable because validation will always happen automatically. Test 3 is an example of carryover from a C# mindset and doesn&#8217;t take full advantage of the power of the knockout implementation of MVVM. It&#8217;s OK to subscribe to your ow properties and can greatly simplify your ViewModel.

I hope this little look into the knockout MVVM library. I really dig it and look forward to using it more.

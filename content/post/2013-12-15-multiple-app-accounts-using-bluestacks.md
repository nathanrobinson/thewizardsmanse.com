---
title: Multiple App Accounts Using BlueStacks
author: nathan
type: post
date: 2013-12-15T17:43:01+00:00
url: /multiple-app-accounts-using-bluestacks/
categories:
  - Challenge
tags:
  - android

---
When you use apps on a device such as an iPhone or Android phone, you may run into a situation where you want to have multiple accounts for the same app. Unfortunately, this can be very hard to do. It usually requires you to uninstall the app and re-install it to switch accounts. Usually these apps don&#8217;t have a PC version, which makes it even harder to manage multiple accounts. The people at BlueStacks have written an Android emulator to allow running apps on a PC (they have a MAC version, but it doesn&#8217;t support the version of Android required to run most apps), so you will need Windows.<!--more-->

To run multiple accounts of an app follow these steps.

  1. Download and install [BlueStacks][1]
  2. Install the app that you want to duplicate, but do not log in or create an account. If you have already logged into the app, then uninstall the app and re-install it.
  3. Open Windows Explorer and go to %ProgramData%\BlueStacks\Android\ you should see a folder called Data.sparsefs
  4. Rename Data.sparsefs to Data1.sparsefs.
  5. Make as many copies of Data1.sparsefs as you need copies of your app. Increment the number after Data each time. You should end up with something like this, but without the Data.sparsefs folder. 
    <div id="attachment_109" style="width: 242px" class="wp-caption aligncenter">
      <a href="/2013/12/Data.jpg"><img class="size-full wp-image-109" alt="data folders" src="/2013/12/Data.jpg" width="232" height="214" /></a>
      
      <p class="wp-caption-text">
        copies of data folders
      </p>
    </div></li> 
    
      * [Download this zip file][2], open it, and copy LaunchApp.bat to %ProgramData%\BlueStacks\Android\
      * Open the apps folder that BlueStacks installed on your desktop. You should see a shortcut to the app that you installed in BlueStacks.
      * Right-click on the shortcut and choose &#8220;properties&#8221;. You should see a window like this: 
        <div id="attachment_111" style="width: 495px" class="wp-caption aligncenter">
          <a href="/2013/12/Properties.jpg"><img class="size-full wp-image-111" alt="link properties" src="/2013/12/Properties.jpg" width="485" height="611" /></a>
          
          <p class="wp-caption-text">
            link properties
          </p>
        </div></li> 
        
          * You&#8217;ll need to edit the text inside the &#8220;Target&#8221; textbox. you want to keep the last two arguments. Those will tell BlueStacks which app you want to launch. If you were editing the twitter link, then
  
            > &#8220;C:\Program Files (x86)\BlueStacks\HD-RunApp.exe&#8221; Android com.twitter.android com.twitter.android.StartActivity
            
            becomes
            
            > %ProgramData%\BlueStacks\Android\LaunchApp.bat 1 com.twitter.android com.twitter.android.StartActivity
            
            Notice that the &#8220;Android&#8221; became a &#8220;1&#8221;. That &#8220;1&#8221; will change for each shortcut to match the Data#.sparsefs that you want to link to.</li> 
            
              * Make a copy of the shortcut for each copy of Data.sparsefs that you created
              * Rename each link with the number that corresponds to the number in your copy of Data.sparsefs
              * Edit the target of each link, just like in step 8. Change the &#8220;1&#8221; to match the number in your copy of Data.sparsefs</ol> 
            
            You should end up with links like these:
            
            <div id="attachment_110" style="width: 376px" class="wp-caption aligncenter">
              <a href="/2013/12/Apps.jpg"><img class="size-full wp-image-110" alt="app links" src="/2013/12/Apps.jpg" width="366" height="470" /></a>
              
              <p class="wp-caption-text">
                links to apps
              </p>
            </div>
            
            Now, when you double-click the links, the batch file will link the proper Data#.sparsefs and launch your app. The first time you run each shortcut you will need to set up a new account. After that, you can switch accounts just by launching the shortcut.

 [1]: http://www.bluestacks.com/
 [2]: /2013/12/LaunchApp.zip

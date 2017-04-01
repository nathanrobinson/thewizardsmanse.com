---
title: Image Processing Part 2
author: nathan
type: post
date: 2013-02-02T21:25:11+00:00
url: /image-processing-part-2/
comments: true
categories:
  - 'c#'
tags:
  - Image Editing
  - 'c#'

---
In [Image Processing Part 1][1] I talked about methods for manipulation image data. If you tried out the <a href="https://github.com/nathanrobinson/ImageTextEncoder" title="ImageTextEncoder" target="_blank">code</a> then you might have noticed it ran really slow.

<!--more-->

Usually, when working with image data it is easier to conceptualize pixel locations in x,y coordinates. I used a System.Drawing.Bitmap to hold the image data, which provides the <a href="http://msdn.microsoft.com/en-us/library/system.drawing.bitmap.getpixel.aspx" title="GetPixel" target="_blank">GetPixel</a> and <a href="http://msdn.microsoft.com/en-us/library/system.drawing.bitmap.setpixel.aspx" title="SetPixel" target="_blank">SetPixel</a> methods to access pixels using x,y coordinates. Unfortunately, this method is extremely slow. When we call this method repeatedly it causes the application to become noticeably sluggish. 

Luckily, there is another way to manipulate pixel data. If we can convert our x,y coordinates into an array notation, then we can call <a href="http://msdn.microsoft.com/en-us/library/5ey6h79d.aspx" title="LockBits" target="_blank">LockBits</a> and access the raw data without any noticeable slowdown. 

The array that is set by LockBits includes the color components of each pixel as defined by the ImageFormat. To find the location of a pixel in the array, you have to multiply the x coordinate by the width of the image an the width of the pixel data. The Bitmap object has a property called Stride which represents the width of the image multiplied by the number of bytes per pixel. You can calculate the array index of a pixel as (x * bitmap.Stride) + y.

When we were using GetPixel and SetPixel, we had to convert the array position of the text into an x,y coordinate for the image. No, instead of converting it back, we can just go straight to the array. 

<pre class="brush: csharp; title: ; notranslate" title="">var bitmapData = image.LockBits( 
                new Rectangle(0, 0, image.Width, image.Height), 
                ImageLockMode.ReadWrite,
                image.PixelFormat);
            
            int length  = Math.Abs(bitmapData.Stride) * image.Height;
            var rgbValues = new byte[length];
            
            System.Runtime.InteropServices.Marshal.Copy(bitmapData.Scan0, rgbValues, 0, length);

            for (var c = 0; c &lt; byteList.Count; c++)
            {
                if(!FastComputePixel(rgbValues, byteList, c, pixelsPerChar, Math.Abs(bitmapData.Stride) / bitmapData.Width))
                    break;
            }

            System.Runtime.InteropServices.Marshal.Copy(rgbValues, 0, bitmapData.Scan0, length);
            image.UnlockBits(bitmapData);
</pre>

The two calls to Marshal.Copy copies the image data to an array that we can manipulate and then copies it back into the image.

And FastComputePixel doesn&#8217;t have to make any calls to the Bitmap object.

<pre class="brush: csharp; title: ; notranslate" title="">private static bool FastComputePixel(byte[] rgbValues, byte b, int c, int pixelsPerChar, int bytesPerPixel)
        {
            var partial = b/pixelsPerChar;
            var last = b - (partial*(pixelsPerChar-1));
            var partialBytes = Enumerable.Repeat(partial, pixelsPerChar - 1).ToList();
            partialBytes.Add(last);
            for (var i = 0; i &lt; pixelsPerChar; i++)
            {
                var pixel = ((c*pixelsPerChar) + i)*bytesPerPixel;
                if (pixel &gt;= rgbValues.Length)
                    return false;

                var red = rgbValues[pixel];
                var blue = rgbValues[pixel + 2];

                var green = (red + blue)/2;
                if (green &gt;= 128)
                    green -= partialBytes[i];
                else
                    green += partialBytes[i];

                rgbValues[pixel + 1] = (byte)green;
            }
            return true;
        }
</pre>

We just call LockBits, manipulate the image data array, and UnlockBits.
  
You should notice the application is much more responsive!

 [1]: /image-processing-part-1/ "Image Processing Part 1"

---
title: Image Processing Part 1
author: nathan
type: post
date: 2012-11-23T04:16:04+00:00
url: /image-processing-part-1/
categories:
  - Challenge
  - Code
  - 'c#'
tags:
  - Image Editing
  - 'c#'

---
This is, hopefully, the first in a series of posts using this codebase. The topics will be varied, but hopefully the codebase will tie them together&#8230;

Can you tell what is different between this image:

[<img class="size-full wp-image-30 aligncenter" title="Redbud" src="/2012/11/Redbud.jpg" alt="Origional Redbud image" width="300" height="200" />][1]

and this one:

[<img class="aligncenter size-full wp-image-31" title="Redbud2" src="/2012/11/Redbud2.jpg" alt="Modified Redbud Image" width="300" height="200" />][2]

Aside from the obvious visual differences, there is an important, hidden difference. You can click-through and grab the original versions and try to figure it out.

The answer is below&#8230;

<!--more-->

I was reading a story in <a href="http://www.asimovs.com" target="_blank">Asimovs</a> a while back (for the life of me, I cannot rember the name or month) where the charactors encoded messages by manipulating the pixels of an image. I thought that was an interesting idea, and decided to try it as a proof of concept.

I created a project that opens an image, encodes some text into the image, and saves the result. It can also open the resulting image, decode the text, and display it. Notice that I said it **encodes** the text and not **encrypts** there is a big difference, and that will be handled later. By merely encoding the text, anyone who knows the algorithm can decode and read the text. The text encoded in the image is no different from text encoded as ASCII or Unicode. It is just an electronic representation of text. The idea here is to use <a href="http://en.wikipedia.org/wiki/Security_through_obscurity" target="_blank">security through obscurity</a>. Anyone seeing the output image by itself should find no obvious signs of an encoded message.

I grabbed a copy of _<a href="http://www.gutenberg.org/ebooks/12" target="_blank">Through the Looking Glass</a>_ from Project Gutenberg and encoded it into the image above. I accomplish this by manipulating the green value of each pixel. Perhaps for this image it would be better to use the blue value&#8230;

Here&#8217;s a look at the code:

First, I need to assign a numeric value to the text that I wish to encode. I use an ASCII encoded to convert the text to a byte array:

<pre class="brush: csharp; title: ; notranslate" title="">public static void Encode(Bitmap image, string text, int pixelsPerByte) 
{
  var bytes = new ASCIIEncoding().GetBytes(text);
  Encode(image, bytes, pixelsPerByte); 
}
</pre>

Because C# uses one byte for each channel of a pixel (red, green, blue, and alpha) and one byte for each character in ASCII text we could simply encode the text directly as an image. This, of course, would nullify our security through obscurity because it wouldn&#8217;t appear to be a real image. Through experimentation, I found that manipulating only one channel to be best. I also don&#8217;t want to completely overwrite an entire channel with a full byte of text, so I split each character across multiple pixels:

<pre class="brush: csharp; title: ; notranslate" title="">public static void Encode(Bitmap image, byte[] bytes, int pixelsPerByte) 
{
  var totalBytes = image.Height*image.Width/pixelsPerByte;
  if(totalBytes &lt; bytes.Length)
    throw new ApplicationException("Image too small to encode text.");
 
  var byteList = bytes.ToList();
  byteList.AddRange(Enumerable.Repeat((byte)0, totalBytes - bytes.Length));
  byteList.Add(0);
 
  for (var c = 0; c &lt; byteList.Count; c++)
  {
    if (ComputePixel(image, byteList, c, pixelsPerByte))
      break;
  }
}
</pre>

Again, through experimentation, I found that 32 pixels per caracter works well.

My method for encoding the data is to average the red and blue channels together and assign that value to the green channel. I then take my partial byte of text and either add it to or subtract it from the green channel.

<pre class="brush: csharp; title: ; notranslate" title="">private static bool ComputePixel(Bitmap image, IReadOnlyList&lt;byte&gt; bytes, int c, int pixelsPerByte)
{
  var b = bytes;
  var partial = b/pixelsPerByte;
  var last = b - (partial*(pixelsPerByte-1));
  var partialBytes = Enumerable.Repeat(partial, pixelsPerByte - 1).ToList();
  partialBytes.Add(last);
  for (var i = 0; i &lt; pixelsPerByte; i++)
  {
    var x = ((c * pixelsPerByte) + i) % image.Width;
    var y = ((c * pixelsPerByte) + i) / image.Width;
    if (y &lt;= image.Height) 
      return true; 
    var color = image.GetPixel(x, y);
    var green = (color.R + color.B)/2;
    
    if (green &gt;= 128)
      green -= partialBytes[i];
    else
      green += partialBytes[i];
    
    color = Color.FromArgb(color.A, color.R, green, color.B);
    image.SetPixel(x, y, color);
  }
  return false; 
}
</pre>

This algorithm is reversible, which is very handy if you want to decode the text&#8230;
  
You may have noticed that the modified image was rather large. That is because we must save the image in a way that doesn&#8217;t modify the bits. .net makes saving the image easy, but using any of the other format will destroy the encoded text when the image is compressed.

<pre class="brush: csharp; title: ; notranslate" title="">private void SaveToolStripMenuItemClick(object sender, EventArgs e)
{
  if (saveFileDialog1.ShowDialog() == DialogResult.OK)
    ((EncoderModel) encoderModelBindingSource.Current).Image.Save(saveFileDialog1.FileName, ImageFormat.MemoryBmp);
}
</pre>

The challenge to you is to create another algorithm that produces a better looking image, while still remaining reversible.

You can download the code from the main branch of my gitHub repository: <a href="https://github.com/nathanrobinson/ImageTextEncoder" target="_blank">nathanrobinson/ImageTextEncoder</a>

Then alter ComputePixel and ComputeByte to encode and decode the text. Some ideas would be to use Hue, Saturation, and Value, instead of Red, Green, and Blue; convert the image from color to grayscale; or something completely different.

Let me know what cool ideas you come up with.

 [1]: /2012/11/Redbud.JPG
 [2]: /2012/11/Redbud2.bmp

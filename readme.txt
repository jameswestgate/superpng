The superpng plug-in has been written to provide a flexible png alpha api to developers using jQuery and who need to support IE6. 
Other scripts didn't provide the performance, features or flexibility that I required, as well as generally not leveraging the jQuery library leading to larger downloaded sizes. 

The script uses either the AlphaImageLoader filter (http://msdn.microsoft.com/en-us/library/ms532969(v=vs.85).aspx) or the vml approach (http://www.dillerdesign.com/experiment/DD_belatedPNG/), depending on the type of tag and whether background-position is required.

For more information on alpha pngs and IE6, please see http://queryj.com.
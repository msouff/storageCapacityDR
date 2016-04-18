#Technical Specifications

####Software Details

<p>This application was built for the purpose of computing reservoir volumes from a
specified location within the Dominican Republic (<a href="http://tethys.byu.edu/apps/storage-capacity/"> Click here to go to the app</a>). The application was designed
using a python script, which was added to an ArcGIS Server as a geoprocessing service, 
and Tethys platform in combination with the ArcGIS API for JavaScript for the front end of the app. 
This application was created by Michael Souffront and Kyugene Lee.</p>

######Compatibility and Limitations

<p>This application only works within the Dominican Republic. However, this same setup can be used with raster data 
from other places in order to get the app working at a different location. The features contained in this application are 
cross browser and will work with most current browsers. However, only Google Chrome and Mozilla Firefox were tested. 
Full functionality for other current browsers is expected but not guaranteed. An ArcGIS Server and general GIS knowledge 
is needed in order to implement the backend portion of this app; that is, preparing and loading raster and vector data and publising 
a geoprocessing service to an ArcGIS Server in order to calculate and store reservoir volume.</p>

######License

<p>This application is licensed under an open source MIT license.</p>

####Application Design

<p>A simple approach was taken when designing the front end part of the app. We tried to make as intuitive as possible. 
A help guide is provided in the app in case any of the steps necessary to run the app is not clear enough. 
The application was designed as a one-page website. It can be accessed from BYU Tethys portal (http://tethys.byu.edu/) as shown in Figure 1 below. 
A zoomed in image of the buttons used to calculate a potential dam and reservoir volume is shown in Figure 2.
After running the application successfully, the calculated reservoir will
appear on the main map window with the calculated reservoir volume in cubic
meters, shown in Figure 3.</span></p>

<=>An alternative to using Tethys is possible, since this app mainly used the ArcGIS API for JavaScript for most of 
its functionality (see main.js file in the repository), however, an HTML page together with styling would need to be 
developed from zero to pursue this alternative.</p>

<img border=0 width=396 height=245 id="Picture 1"
src="https://github.com/msouff/storageCapacityDR/blob/master/tethysapp/storage_capacity/public/images/chooseappSCREENSHOT.JPG">
<p>Figure 1. Home page of Tethys Portal to access Storage Capacity application.</p>

<img border=0 width=301 height=340 id="Picture 3"
src="https://github.com/msouff/storageCapacityDR/blob/master/tethysapp/storage_capacity/public/images/optionSCREENSHOT.JPG">
<p>Figure 2. Functions used to properly run the application.</p>

<img border=0 width=624 height=357 id="Picture 4"
src="https://github.com/msouff/storageCapacityDR/blob/master/tethysapp/storage_capacity/public/images/appSCREENSHOT.JPG">
<p>Figure 3. Final result after successfully running the Storage
Capacity application.</p>

######Main Files

<p>The main files associated with this application include raster data (surface elevation, 
flow direction, and flow accumulation), a map service with the main streams in the Dominican Republic, 
and the geoprocessing service task to calculate storage capacity.</p>

######Code Structure

<p>The basic structure of the Python script that calculates storage capacity is shown in the
flowchart below, Figure 4. The blue filled circles represent input features
necessary for the geoprocessing task to run. The red filled shapes represent processing steps. 
The orange squares represent intermediate features, some of which are also saved as outputs 
(e.g. the watershed and reservoir features). </p>

<img border=0 width=625 height=461 id="Picture 2"
src="https://github.com/msouff/storageCapacityDR/blob/master/tethysapp/storage_capacity/public/images/script_structure.jpg">
<p>Figure 4. Python script structure diagram. This is a simplified diagram. The actual script uses more steps that the ones shown here.</p>

######Key Functions

<p>The following were some of the most important functions used with the ArcGIS API for JavaScript.

<table cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none'>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <pstyle='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Function
  Name</span></b></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border:solid windowtext 1.0pt;
  border-left:none;padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Comments</span></b></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>drawPoint()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>End
  user places point on map</span></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>submitJob()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Application
  runs the geoprocessing task</span></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>completeCallback()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Calls functions to 
  draw results on successfull job requeset</span></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>drawWatershed()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Outlines
  resulting watershed polygon on map</span></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>drawReservoir()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Outlines
  resulting reservoir polygon on map</span></p>
  </td>
 </tr>
 <tr>
  <td width=174 valign=top style='width:130.25pt;border:solid windowtext 1.0pt;
  border-top:none;padding:0in 5.4pt 0in 5.4pt'>
  <p class=MsoNormal style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>getVolume()</span></p>
  </td>
  <td width=450 valign=top style='width:337.25pt;border-top:none;border-left:
  none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
  padding:0in 5.4pt 0in 5.4pt'>
  <p style='margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal'><span style='font-size:12.0pt;font-family:"Times New Roman","serif"'>Makes request to retrieve 
  volume data and calls function to display resulting reservoir volume</span></p>
  </td>
 </tr>
</table>

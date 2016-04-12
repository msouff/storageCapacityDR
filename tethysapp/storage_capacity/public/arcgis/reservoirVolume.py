# -*- coding: utf-8 -*-
# ---------------------------------------------------------------------------
# reservoirVolume.py
# Created on: 2016-03-30 22:53:31.00000
# Created by: Michael Soufftont
# Description: 
# Delineates a watershed and calculates reservoir volume at specific location given dam height.
# ---------------------------------------------------------------------------

# Import arcpy module
import arcpy
from arcpy.sa import *
import sys
import os

arcpy.CheckOutExtension("Spatial")
arcpy.CheckOutExtension("3D")

scriptPath = sys.path[0]
toolDataPath = os.path.join(scriptPath, 'ToolData')
arcpy.env.snapRaster = os.path.join(toolDataPath, 'demfill')
arcpy.env.outputCoordinateSystem = arcpy.SpatialReference('WGS 1984 World Mercator')

# Local variables
filled_dem = r'D:\geo_dev\project3\model_ms_kl\ToolData\demfill'
flow_direction = r'D:\geo_dev\project3\model_ms_kl\ToolData\fdir'
flow_accumulation = r'D:\geo_dev\project3\model_ms_kl\ToolData\facc'
snap_distance = 100

# functions
def checkPourPoint(raster):
    try:
        max = arcpy.GetRasterProperties_management(raster, "MAXIMUM")
        if int(max.getOutput(0)) >= int(36569):
            return True
        else:
            return False
    except:
        return False
    
def getElev(raster):
    max = arcpy.GetRasterProperties_management(raster, "MAXIMUM")
    initElv = max.getOutput(0)
    return float(initElv)

# Script arguments
pour_point = arcpy.GetParameter(0)
height = arcpy.GetParameterAsText(1)
watershedFT = arcpy.GetParameterAsText(2)
reservoir = arcpy.GetParameterAsText(3)
volume = arcpy.GetParameterAsText(4)

# Processsing
Snap_Point_output = SnapPourPoint(pour_point, flow_accumulation, snap_distance, "OBJECTID")

pourPointTest = Times(flow_accumulation, Snap_Point_output)
majorStreamCondition = checkPourPoint(pourPointTest)

if majorStreamCondition == True:
    Watershed_raster = Watershed(flow_direction, Snap_Point_output, "VALUE")
    arcpy.RasterToPolygon_conversion(Watershed_raster, watershedFT, "NO_SIMPLIFY", "VALUE")
    
    demCP = ExtractByMask(filled_dem, watershedFT)
    pointTest = Times(demCP, Snap_Point_output)
    
    initElev = getElev(pointTest)
    reservoirRS = Con(demCP <= float(initElev) + float(height),1,"")
    arcpy.RasterToPolygon_conversion(reservoirRS, reservoir, "SIMPLIFY", "Value")
    
    reserElv = ExtractByMask(filled_dem, reservoir)
    arcpy.SurfaceVolume_3d(reserElv, volume, "BELOW", "", "1", "0")
else:
    with open(volume, "w") as text_file:
        text_file.write("Input point is not close enough to any major streams on record.\n")

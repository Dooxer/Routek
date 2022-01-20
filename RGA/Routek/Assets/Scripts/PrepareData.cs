using System;
using System.Collections.Generic;
using UnityEngine;

public class PrepareData : MonoBehaviour
{
    private DataFromServer dataLoader = new DataFromServer();
    
    void Start()
    {
        //dataLoader.GetRoadDataFromServer();
        //dataLoader.generateTestRoadData();
        //dataLoader.pathToRoadSignData = Application.dataPath + "/trafficSigns.json";
        //dataLoader.LoadRoadSignData();

        //dataLoader.pathToRoadData = Application.dataPath + "/roadCondition.json";
        //dataLoader.LoadRoadData();
        //road = dataLoader.myLittleRoad;
    }

    void Update()
    {
        if (DataFromServer.roadData == null || DataFromServer.roadData.roadData == null || DataFromServer.roadData.roadData.Count == 0) return;

        List<RoadDataServ> roads = DataFromServer.roadData.roadData;

        float minDist = float.MaxValue;
        RoadDataServ closestRoadPoint = null;

        double latitude = GPS.Instance.latitude;
        double longitude = GPS.Instance.longitude;
        foreach (RoadDataServ road in roads)
        {
            float dist = DistanceBetweenPointsInMetres(latitude, longitude, road.latitude, road.longtitude);
            if(minDist > dist)
            {
                minDist = dist;
                closestRoadPoint = road;
            }
        }
    }

    public static double degreesToRadians(double degrees)
    {
        return degrees * Math.PI / 180f;
    }

    public static float DistanceBetweenPointsInMetres(double lat1, double lon1, double lat2, double lon2)
    {
        float earthRadiusKm = 6375f;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(lat1) * Math.Cos(lat2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return (float)(earthRadiusKm * c) * 1000f;
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PrepareData : MonoBehaviour
{

    private DataFromServer dataLoader = new DataFromServer();
    List<RoadDataServ> road;
    private int idx;

    void Start()
    {
        dataLoader.GetRoadDataFromServer();
        //dataLoader.generateTestRoadData();
        //dataLoader.pathToRoadSignData = Application.dataPath + "/trafficSigns.json";
        //dataLoader.LoadRoadSignData();

        //dataLoader.pathToRoadData = Application.dataPath + "/roadCondition.json";
        //dataLoader.LoadRoadData();
        //road = dataLoader.myLittleRoad;
        idx = 1;
    }


    void Update()
    {

        if (idx < road.Count)
        {
            float distance = DistanceBetweenPointsInMetres(road[idx - 1].latitude, road[idx - 1].longtitude,
                                                            road[idx].latitude, road[idx].longtitude);

            string msg = idx.ToString() + ":      " + "(" + road[idx - 1].latitude.ToString() + ", " + road[idx - 1].longtitude.ToString() + ") \t" +
                                                      "(" + road[idx].latitude.ToString() + ", " + road[idx].longtitude.ToString() + ") \n" +
                                                      "distance:" + distance.ToString();
            Debug.Log(msg);
            idx++;
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

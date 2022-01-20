using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class PrepareData : MonoBehaviour
{
    public Camera camera;

    [Tooltip("Max distance in meters from object to display it.")]
    public float maxDistanceFromObject = 50;

    public TextMeshProUGUI text;

    [Tooltip("Order is important, from good to bad.")]
    public List<GameObject> roadsObjects;
    [Tooltip("Order is important, from good to bad.")]
    public List<AudioClip> roadSounds;
    public List<GameObject> signsObjects;

    private string spawnedRoadId = "";
    private int currentQuality;
    private GameObject spawnedRoad;

    private string spawnedSignId = "";
    private GameObject spawnedSign;

    void Update()
    {
        // Roads
        if (DataFromServer.roadData != null && DataFromServer.roadData.roadData != null && DataFromServer.roadData.roadData.Count > 0)
        {
            List<RoadDataServ> roads = DataFromServer.roadData.roadData;

            float minDist = float.MaxValue;
            RoadDataServ closestRoadPoint = null;

            double latitude = GPS.latitude;
            double longitude = GPS.longitude;
            foreach (RoadDataServ road in roads)
            {
                float dist = DistanceBetweenPointsInMetres(latitude, longitude, road.latitude, road.longtitude);
                if (minDist > dist)
                {
                    minDist = dist;
                    closestRoadPoint = road;
                }
            }

            if (closestRoadPoint != null && spawnedRoadId != closestRoadPoint._id && minDist <= maxDistanceFromObject)
            {
                Destroy(spawnedRoad);
                spawnedRoadId = closestRoadPoint._id;
                spawnedRoad = Instantiate(roadsObjects[closestRoadPoint.quality - 1]);
                if(currentQuality != closestRoadPoint.quality)
                {
                    AudioSource audio = GetComponent<AudioSource>();
                    audio.clip = roadSounds[closestRoadPoint.quality - 1];
                    audio.Play();
                }
                currentQuality = closestRoadPoint.quality;
            }
            else if (minDist > maxDistanceFromObject)
            {
                Destroy(spawnedRoad);
            }
        }

        // Signs
        if (DataFromServer.mysigns != null && DataFromServer.mysigns.roadSigns != null && DataFromServer.mysigns.roadSigns.Count > 0)
        {
            List<RoadSignDataServ> signs = DataFromServer.mysigns.roadSigns;

            float minDist = float.MaxValue;
            RoadSignDataServ closestSign = null;

            double latitude = GPS.latitude;
            double longitude = GPS.longitude;
            foreach (RoadSignDataServ sign in signs)
            {
                float dist = DistanceBetweenPointsInMetres(latitude, longitude, sign.latitude, sign.longitude);
                if (minDist > dist)
                {
                    minDist = dist;
                    closestSign = sign;
                }
            }

            if (closestSign != null && spawnedSignId != closestSign._id && minDist <= maxDistanceFromObject)
            {
                Destroy(spawnedSign);
                spawnedSignId = closestSign._id;
                foreach (GameObject sign in signsObjects)
                {
                    if(closestSign.description.Replace("/", "_") == sign.name)
                    {
                        spawnedSign = Instantiate(sign);
                        break;
                    }
                }
            }
            else if(minDist > maxDistanceFromObject)
            {
                Destroy(spawnedSign);
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

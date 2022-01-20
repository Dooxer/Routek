using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UpdateGPSLocation : MonoBehaviour
{
    public Text GPSCoordinates;
    double latitude;
    double longitude;
    // Update is called once per frame
    void Update()
    {
        latitude = GPS.Instance.latitude;
        longitude = GPS.Instance.longitude;

        if (latitude > 0.0)
        {
           // GPSCoordinates.text = "Lati: " + latitude.ToString() + "\n" +
                                //  "Long: " + longitude.ToString();
        }
        else {
            //GPSCoordinates.text = "GPS not returning\nany values";
        }
        
    }
}

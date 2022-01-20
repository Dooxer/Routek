using System;
using TMPro;
using UnityEngine;

public class UpdateGPSLocation : MonoBehaviour
{
    public TextMeshProUGUI text;
    double latitude;
    double longitude;

    // Update is called once per frame
    void Update()
    {
        /*latitude = GPS.Instance.latitude;
        longitude = GPS.Instance.longitude;

        if (latitude > 0.0)
        {
            text.text = "Lati: " + latitude.ToString() + "\n" + "Long: " + longitude.ToString() + "\n\nUpdated: " + DateTime.Now.ToString();
        }
        else {
            text.text = "GPS not returning any values";
        }*/
    }
}

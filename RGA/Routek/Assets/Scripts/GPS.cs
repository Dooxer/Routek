using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.Android;

public class GPS : MonoBehaviour
{
    public TextMeshProUGUI text;

    public static double latitude;
    public static double longitude;

    private bool enableLocation = false;

    void Start()
    {
        DontDestroyOnLoad(gameObject);
        StartCoroutine(StartLocationService());
    }

    private void Update()
    {
        if (!Input.location.isEnabledByUser)
        {
            Permission.RequestUserPermission(Permission.FineLocation);
            text.text = "GPS not enabled!";
        }
        else if(!enableLocation)
        {
            enableLocation = true;
            StartCoroutine(StartLocationService());
        }
    }

    private IEnumerator StartLocationService()
    {
        if (!Input.location.isEnabledByUser)
        {
            text.text = "GPS not enabled!";
            yield break;
        }

        Input.location.Start(1f, 1f);
        int maxWait = 20;
        while(Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
        {
            yield return new WaitForSeconds(1);
            maxWait--;
        }

        if(maxWait <= 0)
        {
            text.text = "GPS Timeout!";
            yield break;
        }

        if(Input.location.status == LocationServiceStatus.Failed)
        {
            text.text = "Location initialization failed";
            yield break;
        }
        latitude = Input.location.lastData.latitude;
        longitude = Input.location.lastData.longitude;
        StartCoroutine(UpdateGPS());
    }

    IEnumerator UpdateGPS()
    {
        float UPDATE_TIME = 1f; //Every  3 seconds
        WaitForSeconds updateTime = new WaitForSeconds(UPDATE_TIME);

        while (true)
        {
            latitude = Input.location.lastData.latitude;
            longitude = Input.location.lastData.longitude;
            yield return updateTime;
        }
    }
}

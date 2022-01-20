using System.Collections;
using TMPro;
using UnityEngine;

public class GPS : MonoBehaviour
{
    public TextMeshProUGUI text;
    public static GPS Instance{set; get;}

    public double latitude;
    public double longitude;

    void Start()
    {
        Instance = this;
        DontDestroyOnLoad(gameObject);
        StartCoroutine(StartLocationService());
    }

    private IEnumerator StartLocationService()
    {
        if (!Input.location.isEnabledByUser)
        {
            text.text = "GPS not enabled!";
            yield break;
        }

        Input.location.Start(0.1f, 0.1f);
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

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GPS : MonoBehaviour
{
    public static GPS Instance{set; get;}

    public double latitude;
    public double longitude;

    IEnumerator coroutine;
    void Start()
    {
        Instance = this;
        coroutine = UpdateGPS();
        //DataFromServer.Instance.GetRoadDataFromServer();
        DontDestroyOnLoad(gameObject);
        StartCoroutine(StartLocationService());
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    private IEnumerator StartLocationService()
    {
        if (!Input.location.isEnabledByUser)
        {
            Debug.Log("GPS not enabled");
            yield break;
        }

        Input.location.Start();
        int maxWait = 20;
        while(Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
        {
            yield return new WaitForSeconds(1);
            maxWait--;
        }

        if(maxWait <= 0)
        {
            Debug.Log("Timed out!");
            yield break;
        }

        if(Input.location.status == LocationServiceStatus.Failed)
        {
            Debug.Log("Location initialization failed");
            yield break;
        }
        latitude = Input.location.lastData.latitude;
        longitude = Input.location.lastData.longitude;
        StartCoroutine(coroutine);
    }

    IEnumerator UpdateGPS()
    {
        float UPDATE_TIME = 3f; //Every  3 seconds
        WaitForSeconds updateTime = new WaitForSeconds(UPDATE_TIME);

        while (true)
        {
            latitude = Input.location.lastData.latitude;
            longitude = Input.location.lastData.longitude;
            yield return updateTime;
        }
    }

}

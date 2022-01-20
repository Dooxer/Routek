using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[System.Serializable]
public class RoadSignDataServ
{
    public string signType;
    public double longitude;
    public double latitude;
}

[System.Serializable]
public class RoadSignsURL
{
    public List<RoadSignDataServ> roadSigns = new List<RoadSignDataServ>();
}


[System.Serializable]
public class RoadDataServ
{
    public int quality;
    public double longtitude;
    public double latitude;
}

[System.Serializable]
public class RoadDataURL
{
    public List<RoadDataServ> roadData = new List<RoadDataServ>();
}
public class DataFromServer : MonoBehaviour
{
    public static DataFromServer Instance { set; get; }
    public static RoadDataURL roadData { set; get; }
    public static RoadSignsURL mysigns { set; get; }

    // Start is called before the first frame update
    protected string roadSignDataURL = "https://projektna.herokuapp.com/signs";
    protected string roadDataURL = "https://projektna.herokuapp.com/roads";

    void Start()
    {
        Instance = this;
        GetRoadDataFromServer();
        // GetSignDataFromServer();
        //DataFromServer.Instance.GetRoadDataFromServer();
        //DontDestroyOnLoad(gameObject);
        //StartCoroutine(StartLocationService());
    }

    public void GetSignDataFromServer()
    {
        StartCoroutine(GetSignData());
    }
    
    IEnumerator GetSignData()
    {
        UnityWebRequest www = UnityWebRequest.Get(roadSignDataURL);
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log("ERROR" + www.error);
        }
        else
        {
            ProcessJSON_Signs(www.downloadHandler.text);
        }
    }


    private void ProcessJSON_Signs(string data)
    {
        data = "{\"roadSigns\":" + data + "}";
        mysigns = JsonUtility.FromJson<RoadSignsURL>(data);
        Debug.Log($"{mysigns}");
    }

    public void GetRoadDataFromServer()
    {
        _ = StartCoroutine(GetRoadData());
    }

    IEnumerator GetRoadData()
    {
        UnityWebRequest www = UnityWebRequest.Get(roadDataURL);
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log("ERROR" + www.error);
        }
        else
        {
            ProcessJSON_Road(www.downloadHandler.text);
        }
    }

    private void ProcessJSON_Road(string data)
    {
        data = "{\"roadData\":" + data + "}";
        roadData = JsonUtility.FromJson<RoadDataURL>(data); 
        Debug.Log($"{roadData}");
    }
}

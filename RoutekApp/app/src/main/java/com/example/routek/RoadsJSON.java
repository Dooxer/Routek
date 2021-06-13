package com.example.routek;

import java.util.ArrayList;
import java.util.List;

public class RoadsJSON {
    private List<Road> roads;

    public RoadsJSON(){
        roads = new ArrayList<>();
    }

    public RoadsJSON(RoadsJSON roadsJSON) {
        this.roads = roadsJSON.roads;
    }

    public void AddRoad(Road road){
        roads.add(road);
    }

    public void ClearRoads(){
        roads.clear();
    }

    public List<Road> getRoads() {
        return roads;
    }
}

package com.example.reloopai.api;

import java.util.List;

public class LocationModels {

    public static class BaseResponse<T> {
        public boolean error;
        public String msg;
        public T data;
    }

    public static class CountryData {
        public String country;
        // ignoring other fields like cities, iso2
    }

    public static class StateData {
        public String name;
        public String state_code;
    }

    public static class StatesResponseData {
        public String country;
        public List<StateData> states;
    }

    public static class StateRequest {
        public String country;
        public StateRequest(String country) {
            this.country = country;
        }
    }

    public static class CityRequest {
        public String country;
        public String state;
        public CityRequest(String country, String state) {
            this.country = country;
            this.state = state;
        }
    }
}

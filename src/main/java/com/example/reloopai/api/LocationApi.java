package com.example.reloopai.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

import java.util.List;

public interface LocationApi {

    @GET("countries")
    Call<LocationModels.BaseResponse<List<LocationModels.CountryData>>> getCountries();

    @POST("countries/states")
    Call<LocationModels.BaseResponse<LocationModels.StatesResponseData>> getStates(@Body LocationModels.StateRequest request);

    @POST("countries/state/cities")
    Call<LocationModels.BaseResponse<List<String>>> getCities(@Body LocationModels.CityRequest request);
}

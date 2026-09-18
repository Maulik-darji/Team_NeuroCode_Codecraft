package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.reloopai.api.LocationApi;
import com.example.reloopai.api.LocationModels;
import com.example.reloopai.api.RetrofitClient;
import com.hbb20.CountryCodePicker;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class IndividualSetupActivity extends AppCompatActivity {

    private Spinner spinnerCountry, spinnerState, spinnerCity;
    private ArrayAdapter<String> countryAdapter, stateAdapter, cityAdapter;
    private List<String> countryList = new ArrayList<>();
    private List<String> stateList = new ArrayList<>();
    private List<String> cityList = new ArrayList<>();

    private LocationApi locationApi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_individual_setup);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        locationApi = RetrofitClient.getClient().create(LocationApi.class);

        ImageView btnBack = findViewById(R.id.iv_back);
        btnBack.setOnClickListener(v -> finish());
        
        EditText etName = findViewById(R.id.et_name);
        EditText etMobile = findViewById(R.id.et_mobile);
        CountryCodePicker ccp = findViewById(R.id.ccp);
        ccp.registerCarrierNumberEditText(etMobile);
        
        EditText etEmail = findViewById(R.id.et_email);
        
        spinnerCountry = findViewById(R.id.spinner_country);
        spinnerState = findViewById(R.id.spinner_state);
        spinnerCity = findViewById(R.id.spinner_city);

        setupSpinners();
        fetchCountries();

        FrameLayout btnCreate = findViewById(R.id.fl_btn_create);
        btnCreate.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            if (name.isEmpty()) {
                Toast.makeText(this, "Please enter your full name", Toast.LENGTH_SHORT).show();
                return;
            }
            
            if (!ccp.isValidFullNumber()) {
                Toast.makeText(this, "Please enter a valid mobile number", Toast.LENGTH_SHORT).show();
                return;
            }
            
            String fullNumber = ccp.getFullNumberWithPlus();
            String location = "";
            if (spinnerCity.getSelectedItem() != null) location += spinnerCity.getSelectedItem().toString() + ", ";
            if (spinnerState.getSelectedItem() != null) location += spinnerState.getSelectedItem().toString() + ", ";
            if (spinnerCountry.getSelectedItem() != null) location += spinnerCountry.getSelectedItem().toString();
            
            Intent intent = new Intent(IndividualSetupActivity.this, SetupCompleteActivity.class);
            intent.putExtra("ORG_NAME", name);
            intent.putExtra("SELECTED_COUNT", 0);
            startActivity(intent);
        });
    }

    private void setupSpinners() {
        countryAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, countryList);
        spinnerCountry.setAdapter(countryAdapter);

        stateAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, stateList);
        spinnerState.setAdapter(stateAdapter);

        cityAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, cityList);
        spinnerCity.setAdapter(cityAdapter);

        spinnerCountry.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedCountry = countryList.get(position);
                fetchStates(selectedCountry);
            }
            @Override public void onNothingSelected(AdapterView<?> parent) {}
        });

        spinnerState.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedCountry = (String) spinnerCountry.getSelectedItem();
                String selectedState = stateList.get(position);
                fetchCities(selectedCountry, selectedState);
            }
            @Override public void onNothingSelected(AdapterView<?> parent) {}
        });
    }

    private void fetchCountries() {
        countryList.clear();
        countryList.add("Loading...");
        countryAdapter.notifyDataSetChanged();

        locationApi.getCountries().enqueue(new Callback<LocationModels.BaseResponse<List<LocationModels.CountryData>>>() {
            @Override
            public void onResponse(Call<LocationModels.BaseResponse<List<LocationModels.CountryData>>> call, Response<LocationModels.BaseResponse<List<LocationModels.CountryData>>> response) {
                countryList.clear();
                if (response.isSuccessful() && response.body() != null && !response.body().error) {
                    for (LocationModels.CountryData data : response.body().data) {
                        countryList.add(data.country);
                    }
                } else {
                    countryList.add("Failed to load");
                }
                countryAdapter.notifyDataSetChanged();
            }

            @Override
            public void onFailure(Call<LocationModels.BaseResponse<List<LocationModels.CountryData>>> call, Throwable t) {
                countryList.clear();
                countryList.add("Error");
                countryAdapter.notifyDataSetChanged();
            }
        });
    }

    private void fetchStates(String country) {
        stateList.clear();
        stateList.add("Loading...");
        stateAdapter.notifyDataSetChanged();

        cityList.clear();
        cityAdapter.notifyDataSetChanged();

        locationApi.getStates(new LocationModels.StateRequest(country)).enqueue(new Callback<LocationModels.BaseResponse<LocationModels.StatesResponseData>>() {
            @Override
            public void onResponse(Call<LocationModels.BaseResponse<LocationModels.StatesResponseData>> call, Response<LocationModels.BaseResponse<LocationModels.StatesResponseData>> response) {
                stateList.clear();
                if (response.isSuccessful() && response.body() != null && !response.body().error) {
                    if (response.body().data.states != null && !response.body().data.states.isEmpty()) {
                        for (LocationModels.StateData data : response.body().data.states) {
                            stateList.add(data.name);
                        }
                    } else {
                        stateList.add("No states available");
                    }
                } else {
                    stateList.add("Failed to load");
                }
                stateAdapter.notifyDataSetChanged();
            }

            @Override
            public void onFailure(Call<LocationModels.BaseResponse<LocationModels.StatesResponseData>> call, Throwable t) {
                stateList.clear();
                stateList.add("Error");
                stateAdapter.notifyDataSetChanged();
            }
        });
    }

    private void fetchCities(String country, String state) {
        cityList.clear();
        cityList.add("Loading...");
        cityAdapter.notifyDataSetChanged();

        locationApi.getCities(new LocationModels.CityRequest(country, state)).enqueue(new Callback<LocationModels.BaseResponse<List<String>>>() {
            @Override
            public void onResponse(Call<LocationModels.BaseResponse<List<String>>> call, Response<LocationModels.BaseResponse<List<String>>> response) {
                cityList.clear();
                if (response.isSuccessful() && response.body() != null && !response.body().error) {
                    if (response.body().data != null && !response.body().data.isEmpty()) {
                        cityList.addAll(response.body().data);
                    } else {
                        cityList.add("No cities available");
                    }
                } else {
                    cityList.add("Failed to load");
                }
                cityAdapter.notifyDataSetChanged();
            }

            @Override
            public void onFailure(Call<LocationModels.BaseResponse<List<String>>> call, Throwable t) {
                cityList.clear();
                cityList.add("Error");
                cityAdapter.notifyDataSetChanged();
            }
        });
    }
}

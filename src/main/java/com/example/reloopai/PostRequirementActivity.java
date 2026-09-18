package com.example.reloopai;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class PostRequirementActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_post_requirement);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        ImageView ivBack = findViewById(R.id.iv_back);
        ivBack.setOnClickListener(v -> finish());

        Spinner spinnerCategory = findViewById(R.id.spinner_category);
        String[] categories = {"Select Category", "Mobiles", "Electronics", "Furniture", "Appliances", "Fashion", "Vehicles", "Tools", "Sports"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        spinnerCategory.setAdapter(adapter);

        EditText etTitle = findViewById(R.id.et_title);
        Button btnSubmit = findViewById(R.id.btn_submit);

        btnSubmit.setOnClickListener(v -> {
            String title = etTitle.getText().toString().trim();
            if (spinnerCategory.getSelectedItemPosition() == 0) {
                Toast.makeText(this, "Please select a category", Toast.LENGTH_SHORT).show();
                return;
            }
            if (title.isEmpty()) {
                Toast.makeText(this, "Please enter an item name", Toast.LENGTH_SHORT).show();
                return;
            }
            
            btnSubmit.setEnabled(false);
            btnSubmit.setText("Submitting...");
            
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Toast.makeText(this, "Requirement posted successfully!", Toast.LENGTH_LONG).show();
                finish();
            }, 1000);
        });
    }
}

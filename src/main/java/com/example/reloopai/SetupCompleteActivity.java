package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class SetupCompleteActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_setup_complete);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Intent intent = getIntent();
        String orgName = intent.getStringExtra("ORG_NAME");
        if (orgName == null || orgName.isEmpty()) orgName = "Shivalik Textiles";
        int selectedCount = intent.getIntExtra("SELECTED_COUNT", 4);

        android.widget.TextView tvTitle = findViewById(R.id.tv_title);
        if (tvTitle != null) {
            tvTitle.setText("Workspace ready,\n" + orgName + ".");
        }

        android.widget.TextView tvResourcesCount = findViewById(R.id.tv_resources_count);
        if (tvResourcesCount != null) {
            tvResourcesCount.setText(selectedCount + " resources connected to meters");
        }

        View ivBack = findViewById(R.id.iv_back);
        if (ivBack != null) {
            ivBack.setOnClickListener(v -> finish());
        }

        View btnContinue = findViewById(R.id.btn_continue);
        if (btnContinue != null) {
            btnContinue.setOnClickListener(v -> {
                Intent dashboardIntent = new Intent(SetupCompleteActivity.this, DashboardActivity.class);
                startActivity(dashboardIntent);
            });
        }
    }
}

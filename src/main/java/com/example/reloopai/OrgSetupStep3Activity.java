package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class OrgSetupStep3Activity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_org_setup_step3);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        
        String orgName = getIntent().getStringExtra("ORG_NAME");

        View btnContinue = findViewById(R.id.btn_continue);
        btnContinue.setOnClickListener(v -> {
            Intent intent = new Intent(OrgSetupStep3Activity.this, OrgSetupStep4Activity.class);
            intent.putExtra("ORG_NAME", orgName);
            startActivity(intent);
        });
        
        
        View btnBack = findViewById(R.id.iv_back);
        if (btnBack != null) btnBack.setOnClickListener(v -> finish());
        
        View btnBackLower = findViewById(R.id.btn_back);
        if (btnBackLower != null) btnBackLower.setOnClickListener(v -> finish());
        
    }
}

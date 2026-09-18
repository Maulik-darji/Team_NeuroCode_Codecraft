package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.reloop.organization.dashboard.OrganizationDashboardActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        
        View mainView = findViewById(R.id.main);
        if (mainView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(mainView, (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });
        }

        Button btnCreateAccount = findViewById(R.id.btn_primary);
        if (btnCreateAccount != null) {
            btnCreateAccount.setOnClickListener(v -> {
                startActivity(new Intent(MainActivity.this, SignupActivity.class));
            });
        }
    
        Button btnLogin = findViewById(R.id.btn_secondary);
        if (btnLogin != null) {
            btnLogin.setOnClickListener(v -> {
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
            });
        }
    }
}
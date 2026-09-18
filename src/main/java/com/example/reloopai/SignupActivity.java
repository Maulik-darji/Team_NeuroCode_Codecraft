package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.firebase.auth.FirebaseAuth;

public class SignupActivity extends AppCompatActivity {
    
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_signup);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        mAuth = FirebaseAuth.getInstance();
        
        ImageView btnBack = findViewById(R.id.iv_back);
        btnBack.setOnClickListener(v -> finish());
        
        EditText etEmail = findViewById(R.id.et_email);
        EditText etPassword = findViewById(R.id.et_password);
        
        FrameLayout btnSignup = findViewById(R.id.fl_btn_signup);
        btnSignup.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                return;
            }
            
            Toast.makeText(this, "Signing up...", Toast.LENGTH_SHORT).show();
            
            mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        Toast.makeText(SignupActivity.this, "Account created successfully", Toast.LENGTH_SHORT).show();
                        // Proceed to choose Organization vs Individual
                        startActivity(new Intent(SignupActivity.this, CreateAccountActivity.class));
                        finish();
                    } else {
                        Toast.makeText(SignupActivity.this, "Sign up failed: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
        });
    }
}

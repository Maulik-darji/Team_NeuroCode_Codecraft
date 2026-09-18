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
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthProvider;

public class OtpActivity extends AppCompatActivity {
    
    private String verificationId;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_otp);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        mAuth = FirebaseAuth.getInstance();
        verificationId = getIntent().getStringExtra("verificationId");
        
        ImageView btnBack = findViewById(R.id.iv_back);
        btnBack.setOnClickListener(v -> finish());
        
        EditText et1 = findViewById(R.id.et_otp_1);
        EditText et2 = findViewById(R.id.et_otp_2);
        EditText et3 = findViewById(R.id.et_otp_3);
        EditText et4 = findViewById(R.id.et_otp_4);
        EditText et5 = findViewById(R.id.et_otp_5);
        EditText et6 = findViewById(R.id.et_otp_6);
        
        FrameLayout btnVerify = findViewById(R.id.fl_btn_verify);
        btnVerify.setOnClickListener(v -> {
            String code = et1.getText().toString() +
                          et2.getText().toString() +
                          et3.getText().toString() +
                          et4.getText().toString() +
                          et5.getText().toString() +
                          et6.getText().toString();
                          
            if (code.length() < 6) {
                Toast.makeText(this, "Please enter all 6 digits", Toast.LENGTH_SHORT).show();
                return;
            }
            
            verifyCode(code);
        });
    }
    
    private void verifyCode(String code) {
        if (verificationId == null) {
            Toast.makeText(this, "Error: missing verification ID", Toast.LENGTH_SHORT).show();
            return;
        }
        
        Toast.makeText(this, "Verifying...", Toast.LENGTH_SHORT).show();
        PhoneAuthCredential credential = PhoneAuthProvider.getCredential(verificationId, code);
        signInWithPhoneAuthCredential(credential);
    }

    private void signInWithPhoneAuthCredential(PhoneAuthCredential credential) {
        mAuth.signInWithCredential(credential)
            .addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    Toast.makeText(OtpActivity.this, "Verification successful", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(OtpActivity.this, DashboardActivity.class);
                    // Clear backstack so user can't go back to OTP screen
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(OtpActivity.this, "Verification failed: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                }
            });
    }
}

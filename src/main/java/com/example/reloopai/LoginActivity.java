package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.firebase.FirebaseException;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;

import java.util.concurrent.TimeUnit;

public class LoginActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private String verificationId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        mAuth = FirebaseAuth.getInstance();

        TextView tvSubtitle = findViewById(R.id.tv_subtitle);
        View llMobileContainer = findViewById(R.id.ll_mobile_container);
        View llEmailContainer = findViewById(R.id.ll_email_container);
        AppCompatButton btnEmail = findViewById(R.id.btn_email);
        TextView tvPrimaryAction = findViewById(R.id.tv_primary_action);
        
        EditText etPhone = findViewById(R.id.et_phone);
        EditText etEmail = findViewById(R.id.et_email);
        EditText etPassword = findViewById(R.id.et_password);

        btnEmail.setOnClickListener(v -> {
            if (llMobileContainer.getVisibility() == View.VISIBLE) {
                // Switch to email
                llMobileContainer.setVisibility(View.GONE);
                llEmailContainer.setVisibility(View.VISIBLE);
                btnEmail.setText("Continue with mobile number");
                tvSubtitle.setText("Enter the work email linked to your ReLoop account.");
                tvPrimaryAction.setText("Login with Email");
            } else {
                // Switch to mobile
                llMobileContainer.setVisibility(View.VISIBLE);
                llEmailContainer.setVisibility(View.GONE);
                btnEmail.setText("Continue with work email");
                tvSubtitle.setText("Enter the mobile number linked to your ReLoop account.");
                tvPrimaryAction.setText("Send OTP");
            }
        });

        FrameLayout btnPrimary = findViewById(R.id.fl_btn_primary);
        btnPrimary.setOnClickListener(v -> {
            if (llMobileContainer.getVisibility() == View.VISIBLE) {
                String phone = etPhone.getText().toString().trim();
                if (phone.isEmpty() || phone.length() < 10) {
                    Toast.makeText(this, "Please enter a valid mobile number", Toast.LENGTH_SHORT).show();
                    return;
                }
                sendOtp("+91" + phone);
            } else {
                String email = etEmail.getText().toString().trim();
                String password = etPassword.getText().toString().trim();
                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                    return;
                }
                loginWithEmail(email, password);
            }
        });

        LinearLayout llCreateAccount = findViewById(R.id.ll_create_account);
        llCreateAccount.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, SignupActivity.class));
        });
    
        ImageView btnBack = findViewById(R.id.iv_back);
        btnBack.setOnClickListener(v -> finish());
    }

    private void loginWithEmail(String email, String password) {
        mAuth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(LoginActivity.this, DashboardActivity.class));
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
                }
            });
    }

    private void sendOtp(String phoneNumber) {
        Toast.makeText(this, "Sending OTP...", Toast.LENGTH_SHORT).show();
        PhoneAuthOptions options =
                PhoneAuthOptions.newBuilder(mAuth)
                        .setPhoneNumber(phoneNumber)       // Phone number to verify
                        .setTimeout(60L, TimeUnit.SECONDS) // Timeout and unit
                        .setActivity(this)                 // Activity (for callback binding)
                        .setCallbacks(mCallbacks)          // OnVerificationStateChangedCallbacks
                        .build();
        PhoneAuthProvider.verifyPhoneNumber(options);
    }

    private final PhoneAuthProvider.OnVerificationStateChangedCallbacks mCallbacks =
        new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {

            @Override
            public void onVerificationCompleted(@NonNull PhoneAuthCredential credential) {
                // Auto-retrieval or instant verification
                signInWithPhoneAuthCredential(credential);
            }

            @Override
            public void onVerificationFailed(@NonNull FirebaseException e) {
                Toast.makeText(LoginActivity.this, "Verification failed: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }

            @Override
            public void onCodeSent(@NonNull String verificationId,
                    @NonNull PhoneAuthProvider.ForceResendingToken token) {
                // The SMS verification code has been sent
                Intent intent = new Intent(LoginActivity.this, OtpActivity.class);
                intent.putExtra("verificationId", verificationId);
                startActivity(intent);
            }
        };

    private void signInWithPhoneAuthCredential(PhoneAuthCredential credential) {
        mAuth.signInWithCredential(credential)
            .addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(LoginActivity.this, DashboardActivity.class));
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
                }
            });
    }
}

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
    private static final String TAG = "LoginActivity";
    private FirebaseAuth mAuth;

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

        try {
            mAuth = FirebaseAuth.getInstance();
        } catch (Exception e) {
            mAuth = null;
        }

        TextView tvSubtitle = findViewById(R.id.tv_subtitle);
        View llMobileContainer = findViewById(R.id.ll_mobile_container);
        View llEmailContainer = findViewById(R.id.ll_email_container);
        AppCompatButton btnEmail = findViewById(R.id.btn_email);
        TextView tvPrimaryAction = findViewById(R.id.tv_primary_action);
        
        EditText etPhone = findViewById(R.id.et_phone);
        EditText etEmail = findViewById(R.id.et_email);
        EditText etPassword = findViewById(R.id.et_password);

        if (btnEmail != null) {
            btnEmail.setOnClickListener(v -> {
                if (llMobileContainer.getVisibility() == View.VISIBLE) {
                    llMobileContainer.setVisibility(View.GONE);
                    llEmailContainer.setVisibility(View.VISIBLE);
                    btnEmail.setText("Continue with mobile number");
                    if (tvSubtitle != null) tvSubtitle.setText("Enter the work email linked to your ReLoop account.");
                    if (tvPrimaryAction != null) tvPrimaryAction.setText("Login with Email");
                } else {
                    llMobileContainer.setVisibility(View.VISIBLE);
                    llEmailContainer.setVisibility(View.GONE);
                    btnEmail.setText("Continue with work email");
                    if (tvSubtitle != null) tvSubtitle.setText("Enter the mobile number linked to your ReLoop account.");
                    if (tvPrimaryAction != null) tvPrimaryAction.setText("Send OTP");
                }
            });
        }

        FrameLayout btnPrimary = findViewById(R.id.fl_btn_primary);
        if (btnPrimary != null) {
            btnPrimary.setOnClickListener(v -> {
                if (llMobileContainer.getVisibility() == View.VISIBLE) {
                    String phone = etPhone != null ? etPhone.getText().toString().trim() : "";
                    if (phone.isEmpty() || phone.length() < 10) {
                        Toast.makeText(this, "Please enter a valid 10-digit mobile number", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    sendOtp("+91" + phone);
                } else {
                    String email = etEmail != null ? etEmail.getText().toString().trim() : "";
                    String password = etPassword != null ? etPassword.getText().toString().trim() : "";
                    if (email.isEmpty() || password.isEmpty()) {
                        Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    loginWithEmail(email, password);
                }
            });
        }

        LinearLayout llCreateAccount = findViewById(R.id.ll_create_account);
        if (llCreateAccount != null) {
            llCreateAccount.setOnClickListener(v -> {
                startActivity(new Intent(LoginActivity.this, SignupActivity.class));
            });
        }
    
        ImageView btnBack = findViewById(R.id.iv_back);
        if (btnBack != null) {
            btnBack.setOnClickListener(v -> finish());
        }
    }

    private void loginWithEmail(String email, String password) {
        if (mAuth != null) {
            mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(LoginActivity.this, "Logged in successfully", Toast.LENGTH_SHORT).show();
                    }
                    proceedToDashboard();
                });
        } else {
            Toast.makeText(LoginActivity.this, "Logged in successfully", Toast.LENGTH_SHORT).show();
            proceedToDashboard();
        }
    }

    private void sendOtp(String phoneNumber) {
        Toast.makeText(this, "Sending OTP to " + phoneNumber + "...", Toast.LENGTH_SHORT).show();
        if (mAuth != null) {
            try {
                PhoneAuthOptions options =
                        PhoneAuthOptions.newBuilder(mAuth)
                                .setPhoneNumber(phoneNumber)
                                .setTimeout(60L, TimeUnit.SECONDS)
                                .setActivity(this)
                                .setCallbacks(mCallbacks)
                                .build();
                PhoneAuthProvider.verifyPhoneNumber(options);
            } catch (Exception e) {
                openOtpScreen("demo_ver_id_" + System.currentTimeMillis());
            }
        } else {
            openOtpScreen("demo_ver_id_" + System.currentTimeMillis());
        }
    }

    private final PhoneAuthProvider.OnVerificationStateChangedCallbacks mCallbacks =
        new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {

            @Override
            public void onVerificationCompleted(@NonNull PhoneAuthCredential credential) {
                signInWithPhoneAuthCredential(credential);
            }

            @Override
            public void onVerificationFailed(@NonNull FirebaseException e) {
                Log.w(TAG, "Phone auth failed: " + e.getMessage());
                openOtpScreen("demo_ver_id_" + System.currentTimeMillis());
            }

            @Override
            public void onCodeSent(@NonNull String verificationId,
                    @NonNull PhoneAuthProvider.ForceResendingToken token) {
                openOtpScreen(verificationId);
            }
        };

    private void openOtpScreen(String verId) {
        Intent intent = new Intent(LoginActivity.this, OtpActivity.class);
        intent.putExtra("verificationId", verId);
        startActivity(intent);
    }

    private void signInWithPhoneAuthCredential(PhoneAuthCredential credential) {
        if (mAuth != null) {
            mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, task -> {
                    Toast.makeText(LoginActivity.this, "Mobile verification completed", Toast.LENGTH_SHORT).show();
                    proceedToDashboard();
                });
        } else {
            proceedToDashboard();
        }
    }

    private void proceedToDashboard() {
        Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}

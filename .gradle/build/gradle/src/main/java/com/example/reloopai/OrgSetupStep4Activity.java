package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class OrgSetupStep4Activity extends AppCompatActivity {
    
    private int selectedCount = 0;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_org_setup_step4);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        
        String orgName = getIntent().getStringExtra("ORG_NAME");
        
        setupCard(R.id.card_electricity, R.id.cb_electricity, R.id.ic_check_electricity);
        setupCard(R.id.card_water, R.id.cb_water, R.id.ic_check_water);
        setupCard(R.id.card_fuel, R.id.cb_fuel, R.id.ic_check_fuel);
        setupCard(R.id.card_materials, R.id.cb_materials, R.id.ic_check_materials);
        setupCard(R.id.card_equipment, R.id.cb_equipment, R.id.ic_check_equipment);
        setupCard(R.id.card_waste, R.id.cb_waste, R.id.ic_check_waste);
        
        View btnContinue = findViewById(R.id.btn_continue);
        btnContinue.setOnClickListener(v -> {
            Intent intent = new Intent(OrgSetupStep4Activity.this, SetupCompleteActivity.class);
            intent.putExtra("ORG_NAME", orgName);
            intent.putExtra("SELECTED_COUNT", selectedCount);
            startActivity(intent);
        });
        
        View btnBack = findViewById(R.id.iv_back);
        if (btnBack != null) btnBack.setOnClickListener(v -> finish());
    }

    private void setupCard(int cardId, int cbId, int iconId) {
        FrameLayout card = findViewById(cardId);
        FrameLayout cb = findViewById(cbId);
        ImageView icon = findViewById(iconId);
        
        if (card == null || cb == null || icon == null) return;
        
        card.setOnClickListener(v -> {
            boolean isSelected = icon.getVisibility() == View.VISIBLE;
            if (isSelected) {
                icon.setVisibility(View.GONE);
                card.setBackgroundResource(R.drawable.bg_card_unchecked);
                cb.setBackgroundResource(R.drawable.bg_checkbox_unchecked);
                selectedCount--;
            } else {
                icon.setVisibility(View.VISIBLE);
                card.setBackgroundResource(R.drawable.bg_card_checked);
                cb.setBackgroundResource(R.drawable.bg_checkbox_checked);
                selectedCount++;
            }
            updateFooterText();
        });
    }
    
    private void updateFooterText() {
        TextView tvCount = findViewById(R.id.tv_selection_count);
        if (tvCount != null) {
            int remaining = 6 - selectedCount;
            tvCount.setText(selectedCount + " resources selected · " + remaining + " available to add later");
        }
    }
}

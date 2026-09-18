package com.example.reloopai;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

public class DashboardActivity extends AppCompatActivity {

    private RecyclerView rvCategories;
    private RecyclerView rvMatches;
    private RecyclerView rvFresh;
    private CategoryAdapter categoryAdapter;
    private ProductAdapter matchesAdapter;
    private ProductAdapter freshAdapter;
    private String selectedCategoryId = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_dashboard);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Setup Bottom Nav
        BottomNavigationView bottomNav = findViewById(R.id.bottom_nav);
        bottomNav.setSelectedItemId(R.id.nav_home);

        // Setup Categories
        rvCategories = findViewById(R.id.rv_categories);
        rvCategories.setLayoutManager(new GridLayoutManager(this, 4));
        categoryAdapter = new CategoryAdapter(getCategoryData(), category -> {
            selectedCategoryId = (selectedCategoryId != null && selectedCategoryId.equals(category.id)) ? null : category.id;
            categoryAdapter.notifyDataSetChanged();
            simulateProductLoading();
        });
        rvCategories.setAdapter(categoryAdapter);

        // Setup Matches
        rvMatches = findViewById(R.id.rv_matches);
        rvMatches.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        matchesAdapter = new ProductAdapter(getMatchesData());
        rvMatches.setAdapter(matchesAdapter);

        // Setup Fresh
        rvFresh = findViewById(R.id.rv_fresh);
        rvFresh.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        freshAdapter = new ProductAdapter(getFreshData());
        rvFresh.setAdapter(freshAdapter);

        // Search Bar Debounce
        EditText etSearch = findViewById(R.id.et_search);
        if(etSearch != null) {
            etSearch.addTextChangedListener(new TextWatcher() {
                Runnable debounce = () -> simulateProductLoading();
                Handler handler = new Handler(Looper.getMainLooper());
                @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
                @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                    handler.removeCallbacks(debounce);
                    handler.postDelayed(debounce, 500);
                }
                @Override public void afterTextChanged(Editable s) {}
            });
        }
        
        // Post Requirement Banner
        View banner = findViewById(R.id.ll_post_banner);
        if(banner != null) {
            banner.setOnClickListener(v -> {
                startActivity(new Intent(DashboardActivity.this, PostRequirementActivity.class));
            });
        }
    }

    private void simulateProductLoading() {
        rvMatches.setAdapter(new SkeletonAdapter());
        rvFresh.setAdapter(new SkeletonAdapter());

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            rvMatches.setAdapter(matchesAdapter);
            rvFresh.setAdapter(freshAdapter);
        }, 800);
    }

    private List<CategoryItem> getCategoryData() {
        List<CategoryItem> list = new ArrayList<>();
        list.add(new CategoryItem("mobiles", "Mobiles", R.drawable.ic_cat_mobile));
        list.add(new CategoryItem("electronics", "Electronics", R.drawable.ic_cat_electronics));
        list.add(new CategoryItem("furniture", "Furniture", R.drawable.ic_cat_furniture));
        list.add(new CategoryItem("appliances", "Appliances", R.drawable.ic_cat_appliances));
        list.add(new CategoryItem("fashion", "Fashion", R.drawable.ic_cat_fashion));
        list.add(new CategoryItem("vehicles", "Vehicles", R.drawable.ic_cat_vehicles));
        list.add(new CategoryItem("tools", "Tools", R.drawable.ic_cat_tools));
        list.add(new CategoryItem("sports", "Sports", R.drawable.ic_cat_sports));
        return list;
    }

    private List<ProductItem> getMatchesData() {
        List<ProductItem> list = new ArrayList<>();
        list.add(new ProductItem("Study table", "₹2,400", "Wooden study table with drawer", "Piplod · 3 km"));
        list.add(new ProductItem("Study table", "₹1,800", "Compact folding study desk", "Adajan · 1 km"));
        list.add(new ProductItem("Study table", "₹2,900", "Engineered wood + chair", "Vesu · 6 km"));
        return list;
    }

    private List<ProductItem> getFreshData() {
        List<ProductItem> list = new ArrayList<>();
        list.add(new ProductItem("Smartphone", "₹12,400", "Used phone in good condition", "Piplod · 3 km"));
        list.add(new ProductItem("Bicycle", "₹4,800", "Mountain bike, lightly used", "Adajan · 1 km"));
        list.add(new ProductItem("Sofa", "₹8,900", "3 seater living room sofa", "Vesu · 6 km"));
        return list;
    }

    // --- Data Models ---
    static class CategoryItem {
        String id, name;
        int iconResId;
        CategoryItem(String id, String name, int iconResId) { this.id = id; this.name = name; this.iconResId = iconResId; }
    }

    static class ProductItem {
        String tag, price, title, location;
        boolean isFav = false;
        ProductItem(String tag, String price, String title, String location) {
            this.tag = tag; this.price = price; this.title = title; this.location = location;
        }
    }

    // --- Adapters ---
    interface OnCategoryClickListener { void onCategoryClick(CategoryItem item); }

    class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.ViewHolder> {
        List<CategoryItem> items;
        OnCategoryClickListener listener;
        CategoryAdapter(List<CategoryItem> items, OnCategoryClickListener listener) { this.items = items; this.listener = listener; }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_category, parent, false));
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            CategoryItem item = items.get(position);
            holder.tvName.setText(item.name);
            holder.ivIcon.setImageResource(item.iconResId);
            
            boolean isSelected = item.id.equals(selectedCategoryId);
            if (isSelected) {
                holder.flBg.setBackgroundResource(R.drawable.bg_category_selected);
                holder.ivIcon.setColorFilter(ContextCompat.getColor(DashboardActivity.this, R.color.cat_icon_selected));
                holder.tvName.setTextColor(ContextCompat.getColor(DashboardActivity.this, R.color.cat_icon_selected));
            } else {
                holder.flBg.setBackgroundResource(R.drawable.bg_category_default);
                holder.ivIcon.setColorFilter(ContextCompat.getColor(DashboardActivity.this, R.color.cat_icon_default));
                holder.tvName.setTextColor(ContextCompat.getColor(DashboardActivity.this, R.color.text_primary));
            }
            
            holder.itemView.setOnClickListener(v -> listener.onCategoryClick(item));
        }

        @Override
        public int getItemCount() { return items.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            FrameLayout flBg;
            ImageView ivIcon;
            TextView tvName;
            ViewHolder(View itemView) {
                super(itemView);
                flBg = itemView.findViewById(R.id.fl_icon_bg);
                ivIcon = itemView.findViewById(R.id.iv_category_icon);
                tvName = itemView.findViewById(R.id.tv_category_name);
            }
        }
    }

    class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ViewHolder> {
        List<ProductItem> items;
        ProductAdapter(List<ProductItem> items) { this.items = items; }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_product_card, parent, false));
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            ProductItem item = items.get(position);
            holder.tvTag.setText(item.tag);
            holder.tvPrice.setText(item.price);
            holder.tvTitle.setText(item.title);
            holder.tvLocation.setText(item.location);
            
            holder.ivHeart.setImageResource(item.isFav ? R.drawable.ic_heart_filled : R.drawable.ic_heart_outline);
            holder.ivHeart.setColorFilter(ContextCompat.getColor(DashboardActivity.this, item.isFav ? android.R.color.holo_red_dark : R.color.text_secondary));
            
            holder.ivHeart.setOnClickListener(v -> {
                item.isFav = !item.isFav;
                notifyItemChanged(position);
            });
            
            holder.itemView.setOnClickListener(v -> Toast.makeText(DashboardActivity.this, "Opening " + item.title, Toast.LENGTH_SHORT).show());
        }

        @Override
        public int getItemCount() { return items.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTag, tvPrice, tvTitle, tvLocation;
            ImageView ivHeart;
            ViewHolder(View itemView) {
                super(itemView);
                tvTag = itemView.findViewById(R.id.tv_category_tag);
                tvPrice = itemView.findViewById(R.id.tv_price);
                tvTitle = itemView.findViewById(R.id.tv_title);
                tvLocation = itemView.findViewById(R.id.tv_location);
                ivHeart = itemView.findViewById(R.id.iv_heart);
            }
        }
    }

    class SkeletonAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
        @NonNull @Override public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new RecyclerView.ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_skeleton_product, parent, false)) {};
        }
        @Override public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {}
        @Override public int getItemCount() { return 3; }
    }
}

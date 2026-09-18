package com.example.reloopai;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

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

import java.util.ArrayList;
import java.util.List;

public class DashboardActivity extends AppCompatActivity {

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

        // Setup Categories Grid
        RecyclerView rvCategories = findViewById(R.id.rv_categories);
        rvCategories.setLayoutManager(new GridLayoutManager(this, 4));
        rvCategories.setAdapter(new CategoryAdapter(getCategoryData()));

        // Setup Matches RecyclerView
        RecyclerView rvMatches = findViewById(R.id.rv_matches);
        rvMatches.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        rvMatches.setAdapter(new ProductAdapter(getMatchesData()));

        // Setup Fresh RecyclerView
        RecyclerView rvFresh = findViewById(R.id.rv_fresh);
        rvFresh.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        rvFresh.setAdapter(new ProductAdapter(getFreshData()));
    }

    private List<CategoryItem> getCategoryData() {
        List<CategoryItem> list = new ArrayList<>();
        list.add(new CategoryItem("Mobiles", R.color.cat_mobiles));
        list.add(new CategoryItem("Electronics", R.color.cat_electronics));
        list.add(new CategoryItem("Furniture", R.color.cat_furniture));
        list.add(new CategoryItem("Appliances", R.color.cat_appliances));
        list.add(new CategoryItem("Fashion", R.color.cat_fashion));
        list.add(new CategoryItem("Vehicles", R.color.cat_vehicles));
        list.add(new CategoryItem("Tools", R.color.cat_tools));
        list.add(new CategoryItem("Sports", R.color.cat_sports));
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
        String name;
        int colorResId;
        CategoryItem(String name, int colorResId) { this.name = name; this.colorResId = colorResId; }
    }

    static class ProductItem {
        String tag, price, title, location;
        ProductItem(String tag, String price, String title, String location) {
            this.tag = tag; this.price = price; this.title = title; this.location = location;
        }
    }

    // --- Adapters ---
    class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.ViewHolder> {
        List<CategoryItem> items;
        CategoryAdapter(List<CategoryItem> items) { this.items = items; }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_category, parent, false));
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            CategoryItem item = items.get(position);
            holder.tvName.setText(item.name);
            holder.colorBox.setBackgroundColor(ContextCompat.getColor(DashboardActivity.this, item.colorResId));
        }

        @Override
        public int getItemCount() { return items.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            View colorBox;
            TextView tvName;
            ViewHolder(View itemView) {
                super(itemView);
                colorBox = itemView.findViewById(R.id.v_color_box);
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
        }

        @Override
        public int getItemCount() { return items.size(); }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTag, tvPrice, tvTitle, tvLocation;
            ViewHolder(View itemView) {
                super(itemView);
                tvTag = itemView.findViewById(R.id.tv_category_tag);
                tvPrice = itemView.findViewById(R.id.tv_price);
                tvTitle = itemView.findViewById(R.id.tv_title);
                tvLocation = itemView.findViewById(R.id.tv_location);
            }
        }
    }
}

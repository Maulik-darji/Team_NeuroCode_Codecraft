package com.reloop.organization.marketplace;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgMarketplaceCategoryBinding;

import java.util.List;

public class MarketplaceCategoryAdapter extends RecyclerView.Adapter<MarketplaceCategoryAdapter.CategoryViewHolder> {

    public interface OnCategoryClickListener {
        void onCategoryClick(MarketplaceCategory category);
    }

    private final List<MarketplaceCategory> categories;
    private final OnCategoryClickListener listener;

    public MarketplaceCategoryAdapter(List<MarketplaceCategory> categories, OnCategoryClickListener listener) {
        this.categories = categories;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgMarketplaceCategoryBinding binding = ItemOrgMarketplaceCategoryBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new CategoryViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        holder.bind(categories.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }

    static class CategoryViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgMarketplaceCategoryBinding binding;

        public CategoryViewHolder(ItemOrgMarketplaceCategoryBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final MarketplaceCategory category, final OnCategoryClickListener listener) {
            binding.tvCategoryName.setText(category.getName());
            try {
                binding.viewCategoryColor.setBackgroundColor(Color.parseColor(category.getColorHex()));
            } catch (Exception e) {
                binding.viewCategoryColor.setBackgroundColor(Color.parseColor("#0F4C3A"));
            }

            if (category.isSelected()) {
                binding.cardCategory.setBackgroundResource(R.drawable.bg_org_badge_normal);
                binding.tvCategoryName.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_primary_forest));
            } else {
                binding.cardCategory.setBackgroundResource(R.drawable.bg_org_card);
                binding.tvCategoryName.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_text_charcoal));
            }

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onCategoryClick(category);
                }
            });
        }
    }
}

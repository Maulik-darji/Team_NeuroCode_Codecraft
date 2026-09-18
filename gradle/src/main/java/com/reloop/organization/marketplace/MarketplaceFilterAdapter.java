package com.reloop.organization.marketplace;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgMarketplaceFilterBinding;

import java.util.List;

public class MarketplaceFilterAdapter extends RecyclerView.Adapter<MarketplaceFilterAdapter.FilterViewHolder> {

    public interface OnFilterChipClickListener {
        void onFilterChipClick(MarketplaceFilterChip chip);
    }

    private final List<MarketplaceFilterChip> chips;
    private final OnFilterChipClickListener listener;

    public MarketplaceFilterAdapter(List<MarketplaceFilterChip> chips, OnFilterChipClickListener listener) {
        this.chips = chips;
        this.listener = listener;
    }

    @NonNull
    @Override
    public FilterViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgMarketplaceFilterBinding binding = ItemOrgMarketplaceFilterBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new FilterViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull FilterViewHolder holder, int position) {
        holder.bind(chips.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return chips.size();
    }

    static class FilterViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgMarketplaceFilterBinding binding;

        public FilterViewHolder(ItemOrgMarketplaceFilterBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final MarketplaceFilterChip chip, final OnFilterChipClickListener listener) {
            binding.tvFilterChip.setText(chip.getLabel());

            if (chip.isSelected()) {
                binding.tvFilterChip.setBackgroundResource(R.drawable.bg_org_button_forest);
                binding.tvFilterChip.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_surface_white));
            } else {
                binding.tvFilterChip.setBackgroundResource(R.drawable.bg_org_button_outline);
                binding.tvFilterChip.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_text_charcoal));
            }

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onFilterChipClick(chip);
                }
            });
        }
    }
}

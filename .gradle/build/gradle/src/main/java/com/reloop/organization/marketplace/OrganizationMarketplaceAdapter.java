package com.reloop.organization.marketplace;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgMarketplaceListingBinding;

import java.util.List;

public class OrganizationMarketplaceAdapter extends RecyclerView.Adapter<OrganizationMarketplaceAdapter.ListingViewHolder> {

    public interface OnListingClickListener {
        void onListingClick(OrganizationMarketplaceItem item);
    }

    private final List<OrganizationMarketplaceItem> listingList;
    private final OnListingClickListener listener;

    public OrganizationMarketplaceAdapter(List<OrganizationMarketplaceItem> listingList, OnListingClickListener listener) {
        this.listingList = listingList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ListingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgMarketplaceListingBinding binding = ItemOrgMarketplaceListingBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new ListingViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ListingViewHolder holder, int position) {
        holder.bind(listingList.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return listingList.size();
    }

    static class ListingViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgMarketplaceListingBinding binding;

        public ListingViewHolder(ItemOrgMarketplaceListingBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final OrganizationMarketplaceItem item, final OnListingClickListener listener) {
            binding.tvListingTitle.setText(item.getTitle());
            binding.tvSellerInfo.setText(item.getSellerName() + " • " + item.getLocation());
            binding.tvPrice.setText(item.getPriceDisplay());
            binding.tvQuantity.setText("· " + item.getQuantityDisplay());
            binding.tvMetadataText.setText(item.getMetadataText());

            binding.tvPlaceholderCategoryTag.setText(item.getCategoryShortCode());
            binding.tvListingStatus.setText(item.getStatus());

            if ("Reserved".equalsIgnoreCase(item.getStatus())) {
                binding.tvListingStatus.setBackgroundResource(R.drawable.bg_org_badge_warning);
                binding.tvListingStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_warning_amber));
            } else if ("Sold".equalsIgnoreCase(item.getStatus())) {
                binding.tvListingStatus.setBackgroundResource(R.drawable.bg_org_badge_critical);
                binding.tvListingStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_critical_red));
            } else {
                binding.tvListingStatus.setBackgroundResource(R.drawable.bg_org_badge_normal);
                binding.tvListingStatus.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_primary_forest));
            }

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onListingClick(item);
                }
            });
        }
    }
}

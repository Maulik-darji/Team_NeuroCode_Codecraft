package com.reloop.organization.resource;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgConsumptionBinding;
import com.reloop.organization.model.HistoricalConsumption;

import java.util.List;

public class ConsumptionAdapter extends RecyclerView.Adapter<ConsumptionAdapter.ConsumptionViewHolder> {

    private final List<HistoricalConsumption> historyList;

    public ConsumptionAdapter(List<HistoricalConsumption> historyList) {
        this.historyList = historyList;
    }

    @NonNull
    @Override
    public ConsumptionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgConsumptionBinding binding = ItemOrgConsumptionBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new ConsumptionViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ConsumptionViewHolder holder, int position) {
        holder.bind(historyList.get(position));
    }

    @Override
    public int getItemCount() {
        return historyList.size();
    }

    static class ConsumptionViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgConsumptionBinding binding;

        public ConsumptionViewHolder(ItemOrgConsumptionBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(HistoricalConsumption item) {
            binding.tvDatePeriod.setText(item.getDatePeriod() + (item.isForecast() ? " (Forecast)" : ""));
            binding.tvTargetDisplay.setText(String.format("Target: %,.0f", item.getTargetConsumption()));
            binding.tvActualConsumption.setText(String.format("%,.0f", item.getActualConsumption()));

            if (item.getVariancePercent() > 0) {
                binding.tvVariance.setText(String.format("+%.1f%%", item.getVariancePercent()));
                binding.tvVariance.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_warning_amber));
            } else {
                binding.tvVariance.setText(String.format("%.1f%%", item.getVariancePercent()));
                binding.tvVariance.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_primary_forest));
            }
        }
    }
}

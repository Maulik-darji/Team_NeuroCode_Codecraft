package com.reloop.organization.alerts;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;
import com.example.reloopai.databinding.ItemOrgAlertBinding;
import com.reloop.organization.model.OrgAlert;

import java.util.List;

public class AlertsAdapter extends RecyclerView.Adapter<AlertsAdapter.AlertViewHolder> {

    private final List<OrgAlert> alertList;

    public AlertsAdapter(List<OrgAlert> alertList) {
        this.alertList = alertList;
    }

    @NonNull
    @Override
    public AlertViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgAlertBinding binding = ItemOrgAlertBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new AlertViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull AlertViewHolder holder, int position) {
        holder.bind(alertList.get(position));
    }

    @Override
    public int getItemCount() {
        return alertList.size();
    }

    static class AlertViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgAlertBinding binding;

        public AlertViewHolder(ItemOrgAlertBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(OrgAlert alert) {
            binding.tvAlertSeverityTag.setText(alert.getSeverity());
            binding.tvAlertTitle.setText(alert.getTitle());
            binding.tvAlertDescription.setText(alert.getDescription());
            binding.tvAlertTimestamp.setText(alert.getTimestamp());

            if ("CRITICAL".equalsIgnoreCase(alert.getSeverity())) {
                binding.ivAlertSeverityIcon.setImageResource(R.drawable.ic_org_critical);
                binding.tvAlertSeverityTag.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_critical_red));
            } else if ("WARNING".equalsIgnoreCase(alert.getSeverity())) {
                binding.ivAlertSeverityIcon.setImageResource(R.drawable.ic_org_warning);
                binding.tvAlertSeverityTag.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_warning_amber));
            } else {
                binding.ivAlertSeverityIcon.setImageResource(R.drawable.ic_org_info);
                binding.tvAlertSeverityTag.setTextColor(ContextCompat.getColor(itemView.getContext(), R.color.org_primary_forest));
            }
        }
    }
}

package com.reloop.organization.recommendation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.databinding.ItemOrgRecommendationBinding;
import com.reloop.organization.model.AIRecommendation;

import java.util.List;

public class RecommendationAdapter extends RecyclerView.Adapter<RecommendationAdapter.RecommendationViewHolder> {

    public interface OnRecommendationActionListener {
        void onApplyRecommendation(AIRecommendation rec);
    }

    private final List<AIRecommendation> list;
    private final OnRecommendationActionListener listener;

    public RecommendationAdapter(List<AIRecommendation> list, OnRecommendationActionListener listener) {
        this.list = list;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RecommendationViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgRecommendationBinding binding = ItemOrgRecommendationBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new RecommendationViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull RecommendationViewHolder holder, int position) {
        holder.bind(list.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    static class RecommendationViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgRecommendationBinding binding;

        public RecommendationViewHolder(ItemOrgRecommendationBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(final AIRecommendation rec, final OnRecommendationActionListener listener) {
            binding.tvRecTitle.setText(rec.getTitle());
            binding.tvRecDescription.setText(rec.getDescription());
            binding.tvReduction.setText(rec.getEstimatedReduction());

            if (rec.isApplied()) {
                binding.btnApplyRecommendation.setText("Action Applied ✓");
                binding.btnApplyRecommendation.setEnabled(false);
            } else {
                binding.btnApplyRecommendation.setText("Apply / Track Action");
                binding.btnApplyRecommendation.setEnabled(true);
            }

            binding.btnApplyRecommendation.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onApplyRecommendation(rec);
                }
            });
        }
    }
}

package com.reloop.organization.marketplace;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.databinding.ItemOrgMediaThumbnailBinding;

import java.util.List;

public class MediaUploadAdapter extends RecyclerView.Adapter<MediaUploadAdapter.MediaViewHolder> {

    public interface OnMediaRemoveClickListener {
        void onRemoveMedia(int position);
    }

    private final List<String> mediaList;
    private final OnMediaRemoveClickListener listener;

    public MediaUploadAdapter(List<String> mediaList, OnMediaRemoveClickListener listener) {
        this.mediaList = mediaList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MediaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemOrgMediaThumbnailBinding binding = ItemOrgMediaThumbnailBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false
        );
        return new MediaViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MediaViewHolder holder, int position) {
        holder.bind(mediaList.get(position), position, listener);
    }

    @Override
    public int getItemCount() {
        return mediaList.size();
    }

    static class MediaViewHolder extends RecyclerView.ViewHolder {
        private final ItemOrgMediaThumbnailBinding binding;

        public MediaViewHolder(ItemOrgMediaThumbnailBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        public void bind(String uriStr, final int position, final OnMediaRemoveClickListener listener) {
            if (position == 0) {
                binding.tvCoverBadge.setVisibility(View.VISIBLE);
            } else {
                binding.tvCoverBadge.setVisibility(View.GONE);
            }

            binding.btnRemoveImage.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) listener.onRemoveMedia(position);
                }
            });
        }
    }
}

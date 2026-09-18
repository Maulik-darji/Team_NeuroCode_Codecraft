package com.reloop.organization.enquiries;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reloopai.R;

import java.util.ArrayList;
import java.util.List;

public class EnquiriesAdapter extends RecyclerView.Adapter<EnquiriesAdapter.ViewHolder> {

    public interface OnEnquiryActionListener {
        void onDecline(OrgEnquiry enquiry);
        void onRespond(OrgEnquiry enquiry);
    }

    private final List<OrgEnquiry> enquiries = new ArrayList<>();
    private final OnEnquiryActionListener actionListener;

    public EnquiriesAdapter(OnEnquiryActionListener actionListener) {
        this.actionListener = actionListener;
    }

    public void setEnquiries(List<OrgEnquiry> newList) {
        enquiries.clear();
        if (newList != null) {
            enquiries.addAll(newList);
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_org_enquiry, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        OrgEnquiry enquiry = enquiries.get(position);
        holder.textBuyerName.setText(enquiry.getBuyerName());
        holder.textAssetDetails.setText(enquiry.getAssetTitle() + " · " + enquiry.getQuantityDisplay());
        holder.textMessage.setText(enquiry.getMessage());
        holder.textFooterDetails.setText(enquiry.getFooterDetails() + " · " + enquiry.getTimestamp());

        // Status tag badge styling
        String tag = enquiry.getStatusTag();
        holder.textStatusTag.setText(tag);
        if ("OFFER".equalsIgnoreCase(tag)) {
            holder.textStatusTag.setBackgroundResource(R.drawable.bg_org_badge_offer);
        } else {
            holder.textStatusTag.setBackgroundResource(R.drawable.bg_org_badge_new);
        }

        holder.btnDecline.setOnClickListener(v -> {
            if (actionListener != null) {
                actionListener.onDecline(enquiry);
            }
        });

        holder.btnRespond.setOnClickListener(v -> {
            if (actionListener != null) {
                actionListener.onRespond(enquiry);
            }
        });
    }

    @Override
    public int getItemCount() {
        return enquiries.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView textBuyerName, textAssetDetails, textStatusTag, textMessage, textFooterDetails;
        Button btnDecline, btnRespond;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            textBuyerName = itemView.findViewById(R.id.textBuyerName);
            textAssetDetails = itemView.findViewById(R.id.textAssetDetails);
            textStatusTag = itemView.findViewById(R.id.textStatusTag);
            textMessage = itemView.findViewById(R.id.textMessage);
            textFooterDetails = itemView.findViewById(R.id.textFooterDetails);
            btnDecline = itemView.findViewById(R.id.btnDecline);
            btnRespond = itemView.findViewById(R.id.btnRespond);
        }
    }
}

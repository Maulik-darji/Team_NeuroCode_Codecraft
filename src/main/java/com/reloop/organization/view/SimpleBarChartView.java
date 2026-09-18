package com.reloop.organization.view;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

import com.reloop.organization.model.HistoricalConsumption;

import java.util.ArrayList;
import java.util.List;

public class SimpleBarChartView extends View {

    private final Paint barPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint forecastBarPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint linePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rectF = new RectF();

    private List<HistoricalConsumption> dataList = new ArrayList<>();
    private double maxValue = 120000;

    public SimpleBarChartView(Context context) {
        super(context);
        init();
    }

    public SimpleBarChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public SimpleBarChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        barPaint.setColor(Color.parseColor("#0F4C3A")); // Forest green
        forecastBarPaint.setColor(Color.parseColor("#DC2626")); // Critical red / forecast highlight
        textPaint.setColor(Color.parseColor("#666666"));
        textPaint.setTextSize(spToPx(10));
        textPaint.setTextAlign(Paint.Align.CENTER);

        linePaint.setColor(Color.parseColor("#E0E0D8"));
        linePaint.setStrokeWidth(dpToPx(1));
    }

    public void setData(List<HistoricalConsumption> data) {
        this.dataList = data != null ? data : new ArrayList<>();
        this.maxValue = 0;
        for (HistoricalConsumption hc : dataList) {
            if (hc.getActualConsumption() > maxValue) {
                maxValue = hc.getActualConsumption();
            }
        }
        if (maxValue <= 0) maxValue = 100000;
        maxValue *= 1.15; // 15% padding top
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (dataList.isEmpty()) return;

        int width = getWidth();
        int height = getHeight();
        float bottomPadding = dpToPx(24);
        float topPadding = dpToPx(20);
        float chartHeight = height - bottomPadding - topPadding;

        // Baseline
        canvas.drawLine(0, height - bottomPadding, width, height - bottomPadding, linePaint);

        int barCount = dataList.size();
        float totalSpace = width;
        float barWidth = (totalSpace / barCount) * 0.55f;
        float step = totalSpace / barCount;

        for (int i = 0; i < barCount; i++) {
            HistoricalConsumption item = dataList.get(i);
            float cx = (i * step) + (step / 2f);
            float left = cx - (barWidth / 2f);
            float right = cx + (barWidth / 2f);

            float ratio = (float) (item.getActualConsumption() / maxValue);
            float barTop = (height - bottomPadding) - (chartHeight * ratio);

            rectF.set(left, barTop, right, height - bottomPadding);

            Paint paint = item.isForecast() ? forecastBarPaint : barPaint;
            canvas.drawRect(rectF, paint);

            // Draw Value text on top
            String valStr = String.valueOf((int) item.getActualConsumption());
            canvas.drawText(valStr, cx, barTop - dpToPx(4), textPaint);

            // Draw Label text on bottom
            canvas.drawText(item.getDatePeriod(), cx, height - dpToPx(6), textPaint);
        }
    }

    private float dpToPx(float dp) {
        return dp * getResources().getDisplayMetrics().density;
    }

    private float spToPx(float sp) {
        return sp * getResources().getDisplayMetrics().scaledDensity;
    }
}

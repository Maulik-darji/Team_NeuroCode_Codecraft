package com.reloop.organization.mock;

import com.reloop.organization.model.AIRecommendation;
import com.reloop.organization.model.ForecastResult;
import com.reloop.organization.model.HistoricalConsumption;
import com.reloop.organization.model.OrgAlert;
import com.reloop.organization.model.OrgProfile;
import com.reloop.organization.model.OrgSummary;
import com.reloop.organization.model.ResourceGoal;
import com.reloop.organization.model.SustainabilityMetrics;
import com.reloop.organization.model.TrackedResource;

import java.util.ArrayList;
import java.util.List;

public class OrganizationMockData {

    public static OrgSummary getMockSummary() {
        return new OrgSummary(
                "Shivalik Textiles",
                "Pandesara Unit",
                "Rhea",
                4, // total tracked
                2, // need attention
                1, // critical count
                1, // warning count
                82.0, // main resource cap
                "Electricity",
                "₹36.2L",
                9, // listings
                4, // enquiries
                2  // offers
        );
    }

    public static List<TrackedResource> getMockResources() {
        List<TrackedResource> list = new ArrayList<>();
        list.add(new TrackedResource(
                "res_1",
                "Electricity",
                "kWh",
                82000,
                100000,
                80.0,
                "WARNING",
                "Pandesara unit • Spinning",
                108400,
                11.4
        ));
        list.add(new TrackedResource(
                "res_2",
                "Water",
                "KL",
                2440,
                4000,
                80.0,
                "SAFE",
                "Pandesara unit • Dyeing",
                2800,
                -3.1
        ));
        list.add(new TrackedResource(
                "res_3",
                "Fuel",
                "L",
                5180,
                8000,
                80.0,
                "SAFE",
                "Boiler Plant",
                6200,
                1.2
        ));
        list.add(new TrackedResource(
                "res_4",
                "Waste",
                "t",
                10.4,
                10.0,
                85.0,
                "CRITICAL",
                "All units • Tonnes",
                12.2,
                19.5
        ));
        return list;
    }

    public static TrackedResource getResourceById(String id) {
        for (TrackedResource r : getMockResources()) {
            if (r.getId().equals(id)) return r;
        }
        return getMockResources().get(0);
    }

    public static ForecastResult getMockForecast(String resourceId) {
        return new ForecastResult(
                "Electricity",
                82000,
                108400,
                100000,
                "HIGH",
                "2026-09-30",
                "Electricity may reach 108,400 kWh by 30 Sept — about 8.4% over your 100,000 kWh threshold.",
                "Updated 08:40"
        );
    }

    public static List<AIRecommendation> getMockRecommendations() {
        List<AIRecommendation> list = new ArrayList<>();
        list.add(new AIRecommendation(
                "rec_1",
                "Shift 2 carding lines to off-peak",
                "Run 22:00–06:00 on the Pandesara feeder to leverage lower off-peak tariffs and balance peak demand.",
                "-4,200 kWh",
                "Daily 22:00 - 06:00",
                false
        ));
        list.add(new AIRecommendation(
                "rec_2",
                "Service compressor #3",
                "Draw 14% above baseline since 2 Sept. Cleaning filters and sealing air line leaks will restore efficiency.",
                "-2,600 kWh",
                "Schedule Maintenance",
                false
        ));
        list.add(new AIRecommendation(
                "rec_3",
                "Stagger DG test runs",
                "Run diesel generator test cycles weekly instead of alternate days during low-demand windows.",
                "-1,900 kWh",
                "Weekly schedule",
                false
        ));
        return list;
    }

    public static List<HistoricalConsumption> getMockHistory() {
        List<HistoricalConsumption> list = new ArrayList<>();
        list.add(new HistoricalConsumption("Apr", 78000, 80000, -2.5, false));
        list.add(new HistoricalConsumption("May", 86000, 85000, +1.1, false));
        list.add(new HistoricalConsumption("Jun", 94000, 90000, +4.4, false));
        list.add(new HistoricalConsumption("Jul", 88000, 90000, -2.2, false));
        list.add(new HistoricalConsumption("Aug", 73600, 85000, -13.4, false));
        list.add(new HistoricalConsumption("Sep", 82000, 90000, +11.4, false));
        list.add(new HistoricalConsumption("30 Sept (Est)", 108400, 100000, +8.4, true));
        return list;
    }

    public static ResourceGoal getMockGoal(String resourceId) {
        return new ResourceGoal(
                "res_1",
                "Electricity",
                "kWh",
                90000,
                100000,
                80,
                95,
                "Pandesara unit • Spinning",
                true,
                true
        );
    }

    public static List<OrgAlert> getMockAlerts() {
        List<OrgAlert> list = new ArrayList<>();
        list.add(new OrgAlert(
                "alt_1",
                "CRITICAL",
                "PREDICTED THRESHOLD BREACH",
                "At the current rate, electricity will exceed the 100,000 kWh cap around 27 September.",
                "Today 08:40",
                false
        ));
        list.add(new OrgAlert(
                "alt_2",
                "CRITICAL",
                "EXCEEDED",
                "Waste generation passed the 10.4 t monthly cap. Sachin unit contributed 62%.",
                "2 days ago",
                false
        ));
        list.add(new OrgAlert(
                "alt_3",
                "WARNING",
                "WARNING THRESHOLD CROSSED",
                "Electricity crossed 80% of threshold (80,120 kWh on day 17 of 30).",
                "Yesterday",
                true
        ));
        list.add(new OrgAlert(
                "alt_4",
                "RESOLVED",
                "RESOLVED",
                "Water usage back under plan. Leak at Sachin cooling tower repaired.",
                "12 Sept",
                true
        ));
        list.add(new OrgAlert(
                "alt_5",
                "INFO",
                "MONITORING PERIOD STARTED",
                "September monitoring period started. Targets carried over from August.",
                "1 Sept",
                true
        ));
        return list;
    }

    public static SustainabilityMetrics getMockSustainabilityMetrics() {
        return new SustainabilityMetrics(
                82,
                88,
                76,
                91,
                81,
                "14,200 kWh",
                48,
                320,
                "₹4.8L",
                "12.4 tonnes"
        );
    }

    public static OrgProfile getMockProfile() {
        return new OrgProfile(
                "Shivalik Textiles",
                "Pandesara Unit",
                "Textile Manufacturing & Processing",
                "Verified Sustainability Leader",
                "Rhea Patel",
                "rhea.patel@shivaliktextiles.com",
                "Pandesara GIDC, Surat, Gujarat",
                82,
                4
        );
    }
}

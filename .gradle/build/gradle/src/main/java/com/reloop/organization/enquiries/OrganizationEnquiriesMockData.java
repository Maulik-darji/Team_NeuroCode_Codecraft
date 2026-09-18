package com.reloop.organization.enquiries;

import java.util.ArrayList;
import java.util.List;

public class OrganizationEnquiriesMockData {

    public static List<OrgEnquiry> getSampleEnquiries() {
        List<OrgEnquiry> list = new ArrayList<>();
        list.add(new OrgEnquiry(
                "ENQ-101",
                "Arihant Fabrics Ltd",
                "Ring frame G32",
                "2 units",
                "NEW",
                "We are setting up a second shed in Palsana. Can you hold both units for a week and share the maintenance log?",
                "Offered ₹11,80,000",
                "2 hrs ago",
                "NEW"
        ));
        list.add(new OrgEnquiry(
                "ENQ-102",
                "Gokul Recyclers",
                "MS offcuts",
                "14 t",
                "NEW",
                "Interested in the full lot. Our truck can collect from Hazira on Friday.",
                "Asked for pickup slot",
                "5 hrs ago",
                "NEW"
        ));
        list.add(new OrgEnquiry(
                "ENQ-103",
                "Sahyog Knitwear",
                "Ring frame G32",
                "1 unit",
                "OFFER",
                "Can you do ₹11,00,000 for one unit, payment on dispatch?",
                "Offer 11% below list",
                "yesterday",
                "NEW"
        ));
        list.add(new OrgEnquiry(
                "ENQ-104",
                "Urban Interiors",
                "Workstations",
                "40 sets",
                "NEW",
                "Need 40 sets for a co-working fitout in Vesu.",
                "Asked for photos & delivery quote",
                "1 day ago",
                "NEW"
        ));
        list.add(new OrgEnquiry(
                "ENQ-105",
                "Vardhman Textiles",
                "Comber E62",
                "3 units",
                "IN TALKS",
                "Inspected site yesterday. Negotiation in progress for batch purchase.",
                "Counter offer ₹18,50,000",
                "2 days ago",
                "IN_TALKS"
        ));
        list.add(new OrgEnquiry(
                "ENQ-106",
                "Gujarat Yarns",
                "Carding Machine C51",
                "1 unit",
                "COMPLETED",
                "Payment received and dispatched on 12 Sept.",
                "Sold at ₹7,50,000",
                "12 Sept",
                "COMPLETED"
        ));
        return list;
    }
}

export interface StateCities {
  state: string;
  cities: string[];
}

export const INDIAN_STATES_AND_CITIES: StateCities[] = [
  {
    state: 'Karnataka',
    cities: ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Tumakuru', 'Shivamogga', 'Ballari'],
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Solapur', 'Kolhapur', 'Navi Mumbai', 'Pimpri-Chinchwad'],
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand', 'Vapi', 'Morbi'],
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thanjavur'],
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'],
  },
  {
    state: 'Delhi NCR & Haryana',
    cities: ['Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad', 'Panipat', 'Ambala', 'Karnal', 'Rohtak', 'Hisar'],
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Kanpur', 'Lucknow', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad'],
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda'],
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar'],
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)'],
  },
  {
    state: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur'],
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa'],
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Balasore'],
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati'],
  },
  {
    state: 'Bihar & Jharkhand',
    cities: ['Patna', 'Gaya', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Muzaffarpur', 'Bhagalpur'],
  },
  {
    state: 'Goa & UTs',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Chandigarh', 'Puducherry', 'Daman', 'Silvassa'],
  },
  {
    state: 'Assam & North East',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Shillong', 'Imphal', 'Agartala', 'Aizawl'],
  },
];

export const ALL_INDIAN_CITIES = Array.from(
  new Set(INDIAN_STATES_AND_CITIES.flatMap((s) => s.cities))
).sort();

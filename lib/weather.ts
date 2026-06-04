export interface CityWeather {
    temp: string;
    condition: string;
    city: string;
    humidity: string;
    wind: string;
    uv: string;
    hailProb: string;
    forecast: { day: string; temp: string; condition: string }[];
}

export const WEATHER_DATA: Record<string, CityWeather> = {
    "Denver, CO": {
        temp: "72°F", condition: "Storm Alert", city: "Denver, CO",
        humidity: "62%", wind: "14 mph NW", uv: "Moderate (4)", hailProb: "65% (Severe Warning)",
        forecast: [
            { day: "Tue (Today)", temp: "72°F", condition: "Storm Alert" },
            { day: "Wed", temp: "68°F", condition: "Heavy Rain" },
            { day: "Thu", temp: "75°F", condition: "Cloudy" },
            { day: "Fri", temp: "79°F", condition: "Partly Sunny" },
            { day: "Sat", temp: "82°F", condition: "Sunny" },
            { day: "Sun", temp: "80°F", condition: "Sunny" },
            { day: "Mon", temp: "78°F", condition: "Sunny" }
        ]
    },
    "Boulder, CO": {
        temp: "68°F", condition: "Storm Alert", city: "Boulder, CO",
        humidity: "68%", wind: "12 mph W", uv: "Low (2)", hailProb: "75% (Severe Warning)",
        forecast: [
            { day: "Tue (Today)", temp: "68°F", condition: "Storm Alert" },
            { day: "Wed", temp: "64°F", condition: "Heavy Rain" },
            { day: "Thu", temp: "70°F", condition: "Cloudy" },
            { day: "Fri", temp: "75°F", condition: "Partly Sunny" },
            { day: "Sat", temp: "78°F", condition: "Sunny" },
            { day: "Sun", temp: "79°F", condition: "Sunny" },
            { day: "Mon", temp: "76°F", condition: "Sunny" }
        ]
    },
    "Salt Lake City, UT": {
        temp: "78°F", condition: "Sunny", city: "Salt Lake City, UT",
        humidity: "22%", wind: "6 mph SE", uv: "High (8)", hailProb: "0%",
        forecast: [
            { day: "Tue (Today)", temp: "78°F", condition: "Sunny" },
            { day: "Wed", temp: "81°F", condition: "Sunny" },
            { day: "Thu", temp: "84°F", condition: "Sunny" },
            { day: "Fri", temp: "82°F", condition: "Partly Sunny" },
            { day: "Sat", temp: "80°F", condition: "Cloudy" },
            { day: "Sun", temp: "83°F", condition: "Sunny" },
            { day: "Mon", temp: "85°F", condition: "Sunny" }
        ]
    },
    "Logan, UT": {
        temp: "74°F", condition: "Partly Sunny", city: "Logan, UT",
        humidity: "28%", wind: "5 mph S", uv: "High (7)", hailProb: "5%",
        forecast: [
            { day: "Tue (Today)", temp: "74°F", condition: "Partly Sunny" },
            { day: "Wed", temp: "77°F", condition: "Sunny" },
            { day: "Thu", temp: "80°F", condition: "Sunny" },
            { day: "Fri", temp: "78°F", condition: "Sunny" },
            { day: "Sat", temp: "75°F", condition: "Cloudy" },
            { day: "Sun", temp: "77°F", condition: "Partly Sunny" },
            { day: "Mon", temp: "81°F", condition: "Sunny" }
        ]
    },
    "Boise, ID": {
        temp: "82°F", condition: "Sunny", city: "Boise, ID",
        humidity: "18%", wind: "8 mph E", uv: "Very High (9)", hailProb: "0%",
        forecast: [
            { day: "Tue (Today)", temp: "82°F", condition: "Sunny" },
            { day: "Wed", temp: "85°F", condition: "Sunny" },
            { day: "Thu", temp: "88°F", condition: "Sunny" },
            { day: "Fri", temp: "86°F", condition: "Sunny" },
            { day: "Sat", temp: "83°F", condition: "Partly Sunny" },
            { day: "Sun", temp: "85°F", condition: "Sunny" },
            { day: "Mon", temp: "89°F", condition: "Sunny" }
        ]
    },
    "Phoenix, AZ": {
        temp: "99°F", condition: "Sunny", city: "Phoenix, AZ",
        humidity: "10%", wind: "10 mph S", uv: "Extreme (11)", hailProb: "0%",
        forecast: [
            { day: "Tue (Today)", temp: "99°F", condition: "Sunny" },
            { day: "Wed", temp: "102°F", condition: "Sunny" },
            { day: "Thu", temp: "104°F", condition: "Sunny" },
            { day: "Fri", temp: "105°F", condition: "Sunny" },
            { day: "Sat", temp: "103°F", condition: "Sunny" },
            { day: "Sun", temp: "101°F", condition: "Sunny" },
            { day: "Mon", temp: "100°F", condition: "Sunny" }
        ]
    }
};

export const getWeatherData = (city: string): CityWeather => {
    // Exact match lookup
    if (WEATHER_DATA[city]) return WEATHER_DATA[city];

    // Case-insensitive/partial match lookup
    const matchKey = Object.keys(WEATHER_DATA).find(
        k => k.toLowerCase().startsWith(city.toLowerCase()) || 
             city.toLowerCase().startsWith(k.toLowerCase())
    );
    if (matchKey) return WEATHER_DATA[matchKey];

    // Dynamic weather generation for custom inputs
    let hash = 0;
    for (let i = 0; i < city.length; i++) {
        hash = city.charCodeAt(i) + ((hash << 5) - hash);
    }
    const tempNum = 60 + Math.abs(hash % 35); // 60 to 95 °F
    const conditions = ["Sunny", "Partly Sunny", "Cloudy", "Heavy Rain", "Storm Alert"];
    const condition = conditions[Math.abs(hash % conditions.length)];
    const humidity = `${30 + Math.abs(hash % 50)}%`;
    const wind = `${5 + Math.abs(hash % 15)} mph ${["N", "S", "E", "W", "NE", "NW", "SE", "SW"][Math.abs(hash % 8)]}`;
    const uvList = ["Low (2)", "Moderate (5)", "High (8)", "Very High (9)", "Extreme (11)"];
    const uv = uvList[Math.abs(hash % uvList.length)];
    const hailProb = condition === "Storm Alert" ? `${40 + Math.abs(hash % 40)}%` : "0%";

    const forecast = [
        { day: "Tue (Today)", temp: `${tempNum}°F`, condition },
        { day: "Wed", temp: `${tempNum - 3}°F`, condition: conditions[Math.abs((hash + 1) % conditions.length)] },
        { day: "Thu", temp: `${tempNum + 2}°F`, condition: conditions[Math.abs((hash + 2) % conditions.length)] },
        { day: "Fri", temp: `${tempNum - 1}°F`, condition: conditions[Math.abs((hash + 3) % conditions.length)] },
        { day: "Sat", temp: `${tempNum + 4}°F`, condition: conditions[Math.abs((hash + 4) % conditions.length)] },
        { day: "Sun", temp: `${tempNum + 1}°F`, condition: conditions[Math.abs((hash + 5) % conditions.length)] },
        { day: "Mon", temp: `${tempNum - 2}°F`, condition: conditions[Math.abs((hash + 6) % conditions.length)] }
    ];

    return {
        temp: `${tempNum}°F`,
        condition,
        city,
        humidity,
        wind,
        uv,
        hailProb,
        forecast
    };
};

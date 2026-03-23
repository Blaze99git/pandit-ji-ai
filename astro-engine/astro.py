import swisseph as swe
import sys
import json
from datetime import datetime

def generate_kundli(dob, time, lat, lon):
    swe.set_ephe_path('.')

    dt = datetime.strptime(f"{dob} {time}", "%Y-%m-%d %H:%M:%S")
    julian_day = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0)

    sun = swe.calc_ut(julian_day, swe.SUN)[0][0]
    moon = swe.calc_ut(julian_day, swe.MOON)[0][0]

    return {
        "sun_degree": sun,
        "moon_degree": moon
    }

if __name__ == "__main__":
    dob = sys.argv[1]
    time = sys.argv[2]
    lat = float(sys.argv[3])
    lon = float(sys.argv[4])

    result = generate_kundli(dob, time, lat, lon)
    print(json.dumps(result))
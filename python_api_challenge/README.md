
# Analysis

* Of the four variables tested, only temperature strongly correlates with latitude, which strongly indicates that temperature increases as one gets closer to the equator (lat 0).
* The equator and tropics also see higher-than-normal humidity. Humidity tends to decrease the farther north the city.
* Though wind speed and cloudiness do display weak correlations to latitude, they are weak enough to say that latitude has little impact on either.


```python
# import dependencies
import random
import pandas as pd
import matplotlib.pyplot as plt
from citipy import citipy
import csv
import openweathermapy.core as owm
import json
import os
from config import api_key
from urllib.error import HTTPError
import seaborn as sb
```


```python
# create a lists of random geographic coordinates in order to create a list of cities
latitude = [random.uniform(-90,90) for x in range(2000)]
longitude = [random.uniform(-180,180) for x in range(2000)]
coordinates = list(zip(latitude, longitude))
# create empty lists to hold city and country codes
city_data = []
cities = []
country = []

```


```python
# loop through the coordinates to grab the city data from citipy
for coordinate_pair in coordinates:
    lat, lon = coordinate_pair
    city_data.append(citipy.nearest_city(lat, lon))

```


```python
# loop through the city data to collect the names and the country codes
for city in city_data:
    name = city.city_name
    country_code = city.country_code
    cities.append(name)
    country.append(country_code)
    

```


```python
# store name, longitute, and latitude into a pandas dataframe
cities_df = pd.DataFrame({
    "Name": cities,
    "Country": country,
   })

# Check dataframe for accuracy
cities_df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Country</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>mx</td>
      <td>paraiso</td>
    </tr>
    <tr>
      <th>1</th>
      <td>pf</td>
      <td>atuona</td>
    </tr>
    <tr>
      <th>2</th>
      <td>pf</td>
      <td>mataura</td>
    </tr>
    <tr>
      <th>3</th>
      <td>mx</td>
      <td>guerrero negro</td>
    </tr>
    <tr>
      <th>4</th>
      <td>wf</td>
      <td>vaitupu</td>
    </tr>
  </tbody>
</table>
</div>




```python
# make sure no duplicate cities made it into the list
cities_df = cities_df.drop_duplicates(subset=['Name'], keep="first")
cities_df = cities_df.reset_index(drop=True)
cities_df.head(35)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Country</th>
      <th>Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>mx</td>
      <td>paraiso</td>
    </tr>
    <tr>
      <th>1</th>
      <td>pf</td>
      <td>atuona</td>
    </tr>
    <tr>
      <th>2</th>
      <td>pf</td>
      <td>mataura</td>
    </tr>
    <tr>
      <th>3</th>
      <td>mx</td>
      <td>guerrero negro</td>
    </tr>
    <tr>
      <th>4</th>
      <td>wf</td>
      <td>vaitupu</td>
    </tr>
    <tr>
      <th>5</th>
      <td>re</td>
      <td>saint-philippe</td>
    </tr>
    <tr>
      <th>6</th>
      <td>gl</td>
      <td>maniitsoq</td>
    </tr>
    <tr>
      <th>7</th>
      <td>za</td>
      <td>port alfred</td>
    </tr>
    <tr>
      <th>8</th>
      <td>sh</td>
      <td>jamestown</td>
    </tr>
    <tr>
      <th>9</th>
      <td>jp</td>
      <td>hasaki</td>
    </tr>
    <tr>
      <th>10</th>
      <td>pf</td>
      <td>rikitea</td>
    </tr>
    <tr>
      <th>11</th>
      <td>au</td>
      <td>port lincoln</td>
    </tr>
    <tr>
      <th>12</th>
      <td>ru</td>
      <td>lavrentiya</td>
    </tr>
    <tr>
      <th>13</th>
      <td>gl</td>
      <td>qaanaaq</td>
    </tr>
    <tr>
      <th>14</th>
      <td>cl</td>
      <td>lebu</td>
    </tr>
    <tr>
      <th>15</th>
      <td>us</td>
      <td>susanville</td>
    </tr>
    <tr>
      <th>16</th>
      <td>br</td>
      <td>maraa</td>
    </tr>
    <tr>
      <th>17</th>
      <td>ru</td>
      <td>strezhevoy</td>
    </tr>
    <tr>
      <th>18</th>
      <td>za</td>
      <td>cape town</td>
    </tr>
    <tr>
      <th>19</th>
      <td>lr</td>
      <td>robertsport</td>
    </tr>
    <tr>
      <th>20</th>
      <td>nz</td>
      <td>kaitangata</td>
    </tr>
    <tr>
      <th>21</th>
      <td>au</td>
      <td>albany</td>
    </tr>
    <tr>
      <th>22</th>
      <td>nz</td>
      <td>bluff</td>
    </tr>
    <tr>
      <th>23</th>
      <td>za</td>
      <td>port elizabeth</td>
    </tr>
    <tr>
      <th>24</th>
      <td>bo</td>
      <td>uyuni</td>
    </tr>
    <tr>
      <th>25</th>
      <td>kz</td>
      <td>inderborskiy</td>
    </tr>
    <tr>
      <th>26</th>
      <td>ao</td>
      <td>namibe</td>
    </tr>
    <tr>
      <th>27</th>
      <td>ec</td>
      <td>puerto ayora</td>
    </tr>
    <tr>
      <th>28</th>
      <td>ca</td>
      <td>brooks</td>
    </tr>
    <tr>
      <th>29</th>
      <td>mu</td>
      <td>quatre cocos</td>
    </tr>
    <tr>
      <th>30</th>
      <td>mg</td>
      <td>taolanaro</td>
    </tr>
    <tr>
      <th>31</th>
      <td>ru</td>
      <td>belushya guba</td>
    </tr>
    <tr>
      <th>32</th>
      <td>ca</td>
      <td>tuktoyaktuk</td>
    </tr>
    <tr>
      <th>33</th>
      <td>ru</td>
      <td>shebunino</td>
    </tr>
    <tr>
      <th>34</th>
      <td>br</td>
      <td>arraial do cabo</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Check to make sure there are enough cities in the database to move forward with analysis
len(cities_df["Name"])
```




    765




```python
# set variables for api calls to Open Weather Map
settings = {"units": "imperial", "appid": api_key}
```


```python
# manually check a few of the cities with the openweather api
test = owm.get_current(cities_df['Name'][34], **settings)
test
```




    {'base': 'stations',
     'clouds': {'all': 75},
     'cod': 200,
     'coord': {'lat': -22.97, 'lon': -42.02},
     'dt': 1528225200,
     'id': 3471451,
     'main': {'humidity': 68,
      'pressure': 1017,
      'temp': 71.6,
      'temp_max': 71.6,
      'temp_min': 71.6},
     'name': 'Arraial do Cabo',
     'sys': {'country': 'BR',
      'id': 4469,
      'message': 0.0036,
      'sunrise': 1528190608,
      'sunset': 1528229396,
      'type': 1},
     'visibility': 10000,
     'weather': [{'description': 'broken clouds',
       'icon': '04d',
       'id': 803,
       'main': 'Clouds'}],
     'wind': {'deg': 90, 'speed': 4.7}}




```python
#create variables that will hold the json data for each city.
city_data = []
url = 'api.openweathermap.org/data/2.5/weather?q='
```


```python
# create a loop that checks if the city from citipy is in the openweathermap database and drops it 
#from the cities list if it isn't.

for city in cities_df['Name']:
    try:
        weather_data = owm.get_current(city, **settings)
        id = weather_data['id']
    except HTTPError:
        print(f"Exception: {city} is not in OWM database.\n")
    else:
        city_data.append(weather_data)
        print(f'Retrieving weather data for {city} ({id})')
        print(f'{url}{city}\n')
```

    Retrieving weather data for paraiso (4011743)
    api.openweathermap.org/data/2.5/weather?q=paraiso
    
    Retrieving weather data for atuona (4020109)
    api.openweathermap.org/data/2.5/weather?q=atuona
    
    Retrieving weather data for mataura (6201424)
    api.openweathermap.org/data/2.5/weather?q=mataura
    
    Retrieving weather data for guerrero negro (4021858)
    api.openweathermap.org/data/2.5/weather?q=guerrero negro
    
    Exception: vaitupu is not in OWM database.
    
    Retrieving weather data for saint-philippe (6138908)
    api.openweathermap.org/data/2.5/weather?q=saint-philippe
    
    Retrieving weather data for maniitsoq (3421982)
    api.openweathermap.org/data/2.5/weather?q=maniitsoq
    
    Retrieving weather data for port alfred (964432)
    api.openweathermap.org/data/2.5/weather?q=port alfred
    
    Retrieving weather data for jamestown (2069194)
    api.openweathermap.org/data/2.5/weather?q=jamestown
    
    Retrieving weather data for hasaki (2112802)
    api.openweathermap.org/data/2.5/weather?q=hasaki
    
    Retrieving weather data for rikitea (4030556)
    api.openweathermap.org/data/2.5/weather?q=rikitea
    
    Retrieving weather data for port lincoln (2063036)
    api.openweathermap.org/data/2.5/weather?q=port lincoln
    
    Retrieving weather data for lavrentiya (4031637)
    api.openweathermap.org/data/2.5/weather?q=lavrentiya
    
    Retrieving weather data for qaanaaq (3831208)
    api.openweathermap.org/data/2.5/weather?q=qaanaaq
    
    Retrieving weather data for lebu (344979)
    api.openweathermap.org/data/2.5/weather?q=lebu
    
    Retrieving weather data for susanville (5572400)
    api.openweathermap.org/data/2.5/weather?q=susanville
    
    Retrieving weather data for maraa (3663475)
    api.openweathermap.org/data/2.5/weather?q=maraa
    
    Retrieving weather data for strezhevoy (1490796)
    api.openweathermap.org/data/2.5/weather?q=strezhevoy
    
    Retrieving weather data for cape town (3369157)
    api.openweathermap.org/data/2.5/weather?q=cape town
    
    Retrieving weather data for robertsport (2274275)
    api.openweathermap.org/data/2.5/weather?q=robertsport
    
    Retrieving weather data for kaitangata (2208248)
    api.openweathermap.org/data/2.5/weather?q=kaitangata
    
    Retrieving weather data for albany (5106834)
    api.openweathermap.org/data/2.5/weather?q=albany
    
    Retrieving weather data for bluff (2175403)
    api.openweathermap.org/data/2.5/weather?q=bluff
    
    Retrieving weather data for port elizabeth (4501427)
    api.openweathermap.org/data/2.5/weather?q=port elizabeth
    
    Retrieving weather data for uyuni (3901903)
    api.openweathermap.org/data/2.5/weather?q=uyuni
    
    Exception: inderborskiy is not in OWM database.
    
    Retrieving weather data for namibe (3347019)
    api.openweathermap.org/data/2.5/weather?q=namibe
    
    Retrieving weather data for puerto ayora (3652764)
    api.openweathermap.org/data/2.5/weather?q=puerto ayora
    
    Retrieving weather data for brooks (5909514)
    api.openweathermap.org/data/2.5/weather?q=brooks
    
    Retrieving weather data for quatre cocos (1106643)
    api.openweathermap.org/data/2.5/weather?q=quatre cocos
    
    Exception: taolanaro is not in OWM database.
    
    Exception: belushya guba is not in OWM database.
    
    Retrieving weather data for tuktoyaktuk (6170031)
    api.openweathermap.org/data/2.5/weather?q=tuktoyaktuk
    
    Retrieving weather data for shebunino (468902)
    api.openweathermap.org/data/2.5/weather?q=shebunino
    
    Retrieving weather data for arraial do cabo (3471451)
    api.openweathermap.org/data/2.5/weather?q=arraial do cabo
    
    Retrieving weather data for ushuaia (3833367)
    api.openweathermap.org/data/2.5/weather?q=ushuaia
    
    Retrieving weather data for busselton (2075265)
    api.openweathermap.org/data/2.5/weather?q=busselton
    
    Retrieving weather data for ribeira grande (3372707)
    api.openweathermap.org/data/2.5/weather?q=ribeira grande
    
    Retrieving weather data for cordoba (3686513)
    api.openweathermap.org/data/2.5/weather?q=cordoba
    
    Exception: korla is not in OWM database.
    
    Retrieving weather data for ipixuna (3408424)
    api.openweathermap.org/data/2.5/weather?q=ipixuna
    
    Retrieving weather data for longyearbyen (2729907)
    api.openweathermap.org/data/2.5/weather?q=longyearbyen
    
    Retrieving weather data for batemans bay (2176639)
    api.openweathermap.org/data/2.5/weather?q=batemans bay
    
    Retrieving weather data for ravels (2788313)
    api.openweathermap.org/data/2.5/weather?q=ravels
    
    Retrieving weather data for hermanus (3366880)
    api.openweathermap.org/data/2.5/weather?q=hermanus
    
    Retrieving weather data for beringovskiy (2126710)
    api.openweathermap.org/data/2.5/weather?q=beringovskiy
    
    Retrieving weather data for forrest city (4111382)
    api.openweathermap.org/data/2.5/weather?q=forrest city
    
    Retrieving weather data for coihaique (3894426)
    api.openweathermap.org/data/2.5/weather?q=coihaique
    
    Retrieving weather data for vila velha (6320062)
    api.openweathermap.org/data/2.5/weather?q=vila velha
    
    Retrieving weather data for terrell (4736028)
    api.openweathermap.org/data/2.5/weather?q=terrell
    
    Exception: tsihombe is not in OWM database.
    
    Retrieving weather data for kununurra (2068110)
    api.openweathermap.org/data/2.5/weather?q=kununurra
    
    Retrieving weather data for castro (3896218)
    api.openweathermap.org/data/2.5/weather?q=castro
    
    Retrieving weather data for mahebourg (934322)
    api.openweathermap.org/data/2.5/weather?q=mahebourg
    
    Retrieving weather data for caravelas (3466980)
    api.openweathermap.org/data/2.5/weather?q=caravelas
    
    Retrieving weather data for rio grande (3451138)
    api.openweathermap.org/data/2.5/weather?q=rio grande
    
    Retrieving weather data for komsomolskiy (1486910)
    api.openweathermap.org/data/2.5/weather?q=komsomolskiy
    
    Retrieving weather data for morro bay (5374920)
    api.openweathermap.org/data/2.5/weather?q=morro bay
    
    Retrieving weather data for lotofaga (4035252)
    api.openweathermap.org/data/2.5/weather?q=lotofaga
    
    Retrieving weather data for ponta do sol (3453439)
    api.openweathermap.org/data/2.5/weather?q=ponta do sol
    
    Retrieving weather data for tiksi (2015306)
    api.openweathermap.org/data/2.5/weather?q=tiksi
    
    Retrieving weather data for avarua (4035715)
    api.openweathermap.org/data/2.5/weather?q=avarua
    
    Retrieving weather data for tura (1254046)
    api.openweathermap.org/data/2.5/weather?q=tura
    
    Retrieving weather data for ondjiva (3346821)
    api.openweathermap.org/data/2.5/weather?q=ondjiva
    
    Retrieving weather data for samarai (2132606)
    api.openweathermap.org/data/2.5/weather?q=samarai
    
    Retrieving weather data for beloha (1067565)
    api.openweathermap.org/data/2.5/weather?q=beloha
    
    Retrieving weather data for hilo (5855927)
    api.openweathermap.org/data/2.5/weather?q=hilo
    
    Exception: bengkulu is not in OWM database.
    
    Exception: grand centre is not in OWM database.
    
    Retrieving weather data for tasiilaq (3424607)
    api.openweathermap.org/data/2.5/weather?q=tasiilaq
    
    Retrieving weather data for vila franca do campo (3372472)
    api.openweathermap.org/data/2.5/weather?q=vila franca do campo
    
    Retrieving weather data for paamiut (3421193)
    api.openweathermap.org/data/2.5/weather?q=paamiut
    
    Retrieving weather data for kapaa (5848280)
    api.openweathermap.org/data/2.5/weather?q=kapaa
    
    Retrieving weather data for kayerkan (1497337)
    api.openweathermap.org/data/2.5/weather?q=kayerkan
    
    Retrieving weather data for nizwa (286987)
    api.openweathermap.org/data/2.5/weather?q=nizwa
    
    Retrieving weather data for carnarvon (1014034)
    api.openweathermap.org/data/2.5/weather?q=carnarvon
    
    Exception: tubruq is not in OWM database.
    
    Exception: marcona is not in OWM database.
    
    Retrieving weather data for alta gracia (3866163)
    api.openweathermap.org/data/2.5/weather?q=alta gracia
    
    Retrieving weather data for amapa (3603330)
    api.openweathermap.org/data/2.5/weather?q=amapa
    
    Retrieving weather data for shizunai (2128025)
    api.openweathermap.org/data/2.5/weather?q=shizunai
    
    Retrieving weather data for gamba (1281256)
    api.openweathermap.org/data/2.5/weather?q=gamba
    
    Retrieving weather data for meulaboh (1214488)
    api.openweathermap.org/data/2.5/weather?q=meulaboh
    
    Retrieving weather data for lagoa (2267254)
    api.openweathermap.org/data/2.5/weather?q=lagoa
    
    Retrieving weather data for shimoda (1852357)
    api.openweathermap.org/data/2.5/weather?q=shimoda
    
    Retrieving weather data for faanui (4034551)
    api.openweathermap.org/data/2.5/weather?q=faanui
    
    Retrieving weather data for arrah (1278483)
    api.openweathermap.org/data/2.5/weather?q=arrah
    
    Exception: mys shmidta is not in OWM database.
    
    Retrieving weather data for jalu (86049)
    api.openweathermap.org/data/2.5/weather?q=jalu
    
    Retrieving weather data for pevek (2122090)
    api.openweathermap.org/data/2.5/weather?q=pevek
    
    Retrieving weather data for east london (1006984)
    api.openweathermap.org/data/2.5/weather?q=east london
    
    Retrieving weather data for itarema (3393692)
    api.openweathermap.org/data/2.5/weather?q=itarema
    
    Retrieving weather data for yellowknife (6185377)
    api.openweathermap.org/data/2.5/weather?q=yellowknife
    
    Retrieving weather data for saskylakh (2017155)
    api.openweathermap.org/data/2.5/weather?q=saskylakh
    
    Exception: warqla is not in OWM database.
    
    Retrieving weather data for santa rosa (3835994)
    api.openweathermap.org/data/2.5/weather?q=santa rosa
    
    Retrieving weather data for dong hoi (1582886)
    api.openweathermap.org/data/2.5/weather?q=dong hoi
    
    Retrieving weather data for chapleau (5919915)
    api.openweathermap.org/data/2.5/weather?q=chapleau
    
    Retrieving weather data for bredasdorp (1015776)
    api.openweathermap.org/data/2.5/weather?q=bredasdorp
    
    Retrieving weather data for mount isa (2065594)
    api.openweathermap.org/data/2.5/weather?q=mount isa
    
    Retrieving weather data for bonavista (5905393)
    api.openweathermap.org/data/2.5/weather?q=bonavista
    
    Retrieving weather data for rio gallegos (3838859)
    api.openweathermap.org/data/2.5/weather?q=rio gallegos
    
    Retrieving weather data for aswan (359792)
    api.openweathermap.org/data/2.5/weather?q=aswan
    
    Retrieving weather data for kokstad (988356)
    api.openweathermap.org/data/2.5/weather?q=kokstad
    
    Retrieving weather data for pangnirtung (6096551)
    api.openweathermap.org/data/2.5/weather?q=pangnirtung
    
    Retrieving weather data for te anau (2181625)
    api.openweathermap.org/data/2.5/weather?q=te anau
    
    Retrieving weather data for iqaluit (5983720)
    api.openweathermap.org/data/2.5/weather?q=iqaluit
    
    Retrieving weather data for camacha (2270385)
    api.openweathermap.org/data/2.5/weather?q=camacha
    
    Retrieving weather data for okinawa (3909360)
    api.openweathermap.org/data/2.5/weather?q=okinawa
    
    Exception: barentsburg is not in OWM database.
    
    Retrieving weather data for barrow (3833859)
    api.openweathermap.org/data/2.5/weather?q=barrow
    
    Retrieving weather data for rosetown (6127749)
    api.openweathermap.org/data/2.5/weather?q=rosetown
    
    Retrieving weather data for luderitz (3355672)
    api.openweathermap.org/data/2.5/weather?q=luderitz
    
    Exception: alotau is not in OWM database.
    
    Retrieving weather data for namatanai (2090021)
    api.openweathermap.org/data/2.5/weather?q=namatanai
    
    Retrieving weather data for vao (588365)
    api.openweathermap.org/data/2.5/weather?q=vao
    
    Retrieving weather data for teguise (2510573)
    api.openweathermap.org/data/2.5/weather?q=teguise
    
    Retrieving weather data for lapao (3458817)
    api.openweathermap.org/data/2.5/weather?q=lapao
    
    Retrieving weather data for kavaratti (1267390)
    api.openweathermap.org/data/2.5/weather?q=kavaratti
    
    Retrieving weather data for upernavik (3418910)
    api.openweathermap.org/data/2.5/weather?q=upernavik
    
    Retrieving weather data for lidkoping (2696329)
    api.openweathermap.org/data/2.5/weather?q=lidkoping
    
    Retrieving weather data for georgetown (3378644)
    api.openweathermap.org/data/2.5/weather?q=georgetown
    
    Retrieving weather data for jian (1259047)
    api.openweathermap.org/data/2.5/weather?q=jian
    
    Retrieving weather data for kloulklubed (7671223)
    api.openweathermap.org/data/2.5/weather?q=kloulklubed
    
    Retrieving weather data for tateyama (1849876)
    api.openweathermap.org/data/2.5/weather?q=tateyama
    
    Retrieving weather data for luwuk (1637001)
    api.openweathermap.org/data/2.5/weather?q=luwuk
    
    Retrieving weather data for hambantota (1244926)
    api.openweathermap.org/data/2.5/weather?q=hambantota
    
    Retrieving weather data for medicine hat (6071618)
    api.openweathermap.org/data/2.5/weather?q=medicine hat
    
    Retrieving weather data for rojhan (1166819)
    api.openweathermap.org/data/2.5/weather?q=rojhan
    
    Retrieving weather data for manama (292953)
    api.openweathermap.org/data/2.5/weather?q=manama
    
    Retrieving weather data for rong kwang (1606983)
    api.openweathermap.org/data/2.5/weather?q=rong kwang
    
    Retrieving weather data for punta arenas (3874787)
    api.openweathermap.org/data/2.5/weather?q=punta arenas
    
    Exception: juifang is not in OWM database.
    
    Retrieving weather data for northam (2641434)
    api.openweathermap.org/data/2.5/weather?q=northam
    
    Retrieving weather data for lata (1253628)
    api.openweathermap.org/data/2.5/weather?q=lata
    
    Retrieving weather data for visby (2662689)
    api.openweathermap.org/data/2.5/weather?q=visby
    
    Retrieving weather data for kodiak (4407665)
    api.openweathermap.org/data/2.5/weather?q=kodiak
    
    Retrieving weather data for poum (787487)
    api.openweathermap.org/data/2.5/weather?q=poum
    
    Retrieving weather data for seoul (1835848)
    api.openweathermap.org/data/2.5/weather?q=seoul
    
    Exception: bac lieu is not in OWM database.
    
    Retrieving weather data for klaksvik (2618795)
    api.openweathermap.org/data/2.5/weather?q=klaksvik
    
    Retrieving weather data for kavieng (2094342)
    api.openweathermap.org/data/2.5/weather?q=kavieng
    
    Retrieving weather data for pionerskiy (1494949)
    api.openweathermap.org/data/2.5/weather?q=pionerskiy
    
    Retrieving weather data for radom (760778)
    api.openweathermap.org/data/2.5/weather?q=radom
    
    Retrieving weather data for beldanga (1276548)
    api.openweathermap.org/data/2.5/weather?q=beldanga
    
    Retrieving weather data for el campo (4688506)
    api.openweathermap.org/data/2.5/weather?q=el campo
    
    Retrieving weather data for belmonte (8010472)
    api.openweathermap.org/data/2.5/weather?q=belmonte
    
    Exception: tabiauea is not in OWM database.
    
    Retrieving weather data for makakilo city (5850554)
    api.openweathermap.org/data/2.5/weather?q=makakilo city
    
    Retrieving weather data for port hedland (2063042)
    api.openweathermap.org/data/2.5/weather?q=port hedland
    
    Retrieving weather data for nome (4732862)
    api.openweathermap.org/data/2.5/weather?q=nome
    
    Retrieving weather data for la estancia (3690584)
    api.openweathermap.org/data/2.5/weather?q=la estancia
    
    Retrieving weather data for talnakh (1490256)
    api.openweathermap.org/data/2.5/weather?q=talnakh
    
    Exception: nizhneyansk is not in OWM database.
    
    Retrieving weather data for tagusao (1684245)
    api.openweathermap.org/data/2.5/weather?q=tagusao
    
    Retrieving weather data for sangmelima (2222230)
    api.openweathermap.org/data/2.5/weather?q=sangmelima
    
    Retrieving weather data for lompoc (5367788)
    api.openweathermap.org/data/2.5/weather?q=lompoc
    
    Retrieving weather data for mareeba (2158767)
    api.openweathermap.org/data/2.5/weather?q=mareeba
    
    Retrieving weather data for fairbanks (5861897)
    api.openweathermap.org/data/2.5/weather?q=fairbanks
    
    Retrieving weather data for vagur (2610806)
    api.openweathermap.org/data/2.5/weather?q=vagur
    
    Retrieving weather data for barra patuca (3614835)
    api.openweathermap.org/data/2.5/weather?q=barra patuca
    
    Retrieving weather data for kizema (547871)
    api.openweathermap.org/data/2.5/weather?q=kizema
    
    Exception: illoqqortoormiut is not in OWM database.
    
    Retrieving weather data for hidrolandia (3398457)
    api.openweathermap.org/data/2.5/weather?q=hidrolandia
    
    Retrieving weather data for kampene (214575)
    api.openweathermap.org/data/2.5/weather?q=kampene
    
    Retrieving weather data for new norfolk (2155415)
    api.openweathermap.org/data/2.5/weather?q=new norfolk
    
    Retrieving weather data for ternate (1682474)
    api.openweathermap.org/data/2.5/weather?q=ternate
    
    Retrieving weather data for iisalmi (656820)
    api.openweathermap.org/data/2.5/weather?q=iisalmi
    
    Retrieving weather data for peniche (2264923)
    api.openweathermap.org/data/2.5/weather?q=peniche
    
    Retrieving weather data for ossora (2122389)
    api.openweathermap.org/data/2.5/weather?q=ossora
    
    Retrieving weather data for fort nelson (5955902)
    api.openweathermap.org/data/2.5/weather?q=fort nelson
    
    Retrieving weather data for chuy (3443061)
    api.openweathermap.org/data/2.5/weather?q=chuy
    
    Retrieving weather data for butaritari (2110227)
    api.openweathermap.org/data/2.5/weather?q=butaritari
    
    Exception: kazanskoye is not in OWM database.
    
    Retrieving weather data for constitucion (4011743)
    api.openweathermap.org/data/2.5/weather?q=constitucion
    
    Retrieving weather data for airai (1651810)
    api.openweathermap.org/data/2.5/weather?q=airai
    
    Retrieving weather data for marovoay (1059507)
    api.openweathermap.org/data/2.5/weather?q=marovoay
    
    Exception: tumannyy is not in OWM database.
    
    Retrieving weather data for kruisfontein (986717)
    api.openweathermap.org/data/2.5/weather?q=kruisfontein
    
    Retrieving weather data for taoudenni (2450173)
    api.openweathermap.org/data/2.5/weather?q=taoudenni
    
    Retrieving weather data for madingou (2257990)
    api.openweathermap.org/data/2.5/weather?q=madingou
    
    Retrieving weather data for alice springs (2077895)
    api.openweathermap.org/data/2.5/weather?q=alice springs
    
    Retrieving weather data for kapuskasing (5989403)
    api.openweathermap.org/data/2.5/weather?q=kapuskasing
    
    Retrieving weather data for aksu (1524298)
    api.openweathermap.org/data/2.5/weather?q=aksu
    
    Retrieving weather data for torbay (6167817)
    api.openweathermap.org/data/2.5/weather?q=torbay
    
    Retrieving weather data for pachino (6539213)
    api.openweathermap.org/data/2.5/weather?q=pachino
    
    Retrieving weather data for opuwo (3354077)
    api.openweathermap.org/data/2.5/weather?q=opuwo
    
    Retrieving weather data for saldanha (2737599)
    api.openweathermap.org/data/2.5/weather?q=saldanha
    
    Retrieving weather data for puyo (3652584)
    api.openweathermap.org/data/2.5/weather?q=puyo
    
    Retrieving weather data for arvika (2725123)
    api.openweathermap.org/data/2.5/weather?q=arvika
    
    Retrieving weather data for saint george (262462)
    api.openweathermap.org/data/2.5/weather?q=saint george
    
    Retrieving weather data for athabasca (5887916)
    api.openweathermap.org/data/2.5/weather?q=athabasca
    
    Retrieving weather data for ilulissat (3423146)
    api.openweathermap.org/data/2.5/weather?q=ilulissat
    
    Retrieving weather data for tshikapa (204953)
    api.openweathermap.org/data/2.5/weather?q=tshikapa
    
    Retrieving weather data for hithadhoo (1282256)
    api.openweathermap.org/data/2.5/weather?q=hithadhoo
    
    Retrieving weather data for lubumbashi (922704)
    api.openweathermap.org/data/2.5/weather?q=lubumbashi
    
    Retrieving weather data for palauig (1696188)
    api.openweathermap.org/data/2.5/weather?q=palauig
    
    Retrieving weather data for cidreira (3466165)
    api.openweathermap.org/data/2.5/weather?q=cidreira
    
    Retrieving weather data for provideniya (4031574)
    api.openweathermap.org/data/2.5/weather?q=provideniya
    
    Retrieving weather data for henties bay (3356832)
    api.openweathermap.org/data/2.5/weather?q=henties bay
    
    Retrieving weather data for nikolskoye (546105)
    api.openweathermap.org/data/2.5/weather?q=nikolskoye
    
    Retrieving weather data for srednekolymsk (2121025)
    api.openweathermap.org/data/2.5/weather?q=srednekolymsk
    
    Retrieving weather data for dukat (786562)
    api.openweathermap.org/data/2.5/weather?q=dukat
    
    Retrieving weather data for cabo san lucas (3985710)
    api.openweathermap.org/data/2.5/weather?q=cabo san lucas
    
    Retrieving weather data for fortuna (2517679)
    api.openweathermap.org/data/2.5/weather?q=fortuna
    
    Retrieving weather data for san ramon de la nueva oran (3836620)
    api.openweathermap.org/data/2.5/weather?q=san ramon de la nueva oran
    
    Exception: amderma is not in OWM database.
    
    Exception: mergui is not in OWM database.
    
    Retrieving weather data for huilong (1795424)
    api.openweathermap.org/data/2.5/weather?q=huilong
    
    Exception: yershov is not in OWM database.
    
    Retrieving weather data for bambous virieux (1106677)
    api.openweathermap.org/data/2.5/weather?q=bambous virieux
    
    Retrieving weather data for vaini (1273574)
    api.openweathermap.org/data/2.5/weather?q=vaini
    
    Retrieving weather data for parabel (1495586)
    api.openweathermap.org/data/2.5/weather?q=parabel
    
    Retrieving weather data for coquimbo (3893629)
    api.openweathermap.org/data/2.5/weather?q=coquimbo
    
    Retrieving weather data for sambava (1056899)
    api.openweathermap.org/data/2.5/weather?q=sambava
    
    Retrieving weather data for hofn (2630299)
    api.openweathermap.org/data/2.5/weather?q=hofn
    
    Retrieving weather data for tubalan (1681257)
    api.openweathermap.org/data/2.5/weather?q=tubalan
    
    Retrieving weather data for vestmanna (2610343)
    api.openweathermap.org/data/2.5/weather?q=vestmanna
    
    Retrieving weather data for pangody (1495626)
    api.openweathermap.org/data/2.5/weather?q=pangody
    
    Retrieving weather data for portlethen (2640030)
    api.openweathermap.org/data/2.5/weather?q=portlethen
    
    Retrieving weather data for chokurdakh (2126123)
    api.openweathermap.org/data/2.5/weather?q=chokurdakh
    
    Exception: hallingby is not in OWM database.
    
    Retrieving weather data for sitka (4267710)
    api.openweathermap.org/data/2.5/weather?q=sitka
    
    Exception: grand river south east is not in OWM database.
    
    Retrieving weather data for jaguaribe (3397675)
    api.openweathermap.org/data/2.5/weather?q=jaguaribe
    
    Retrieving weather data for bilibino (2126682)
    api.openweathermap.org/data/2.5/weather?q=bilibino
    
    Retrieving weather data for japura (1642773)
    api.openweathermap.org/data/2.5/weather?q=japura
    
    Retrieving weather data for maceio (3395981)
    api.openweathermap.org/data/2.5/weather?q=maceio
    
    Retrieving weather data for kaseda (1859964)
    api.openweathermap.org/data/2.5/weather?q=kaseda
    
    Retrieving weather data for hay river (5972762)
    api.openweathermap.org/data/2.5/weather?q=hay river
    
    Retrieving weather data for gushikawa (1863495)
    api.openweathermap.org/data/2.5/weather?q=gushikawa
    
    Retrieving weather data for bratslav (711459)
    api.openweathermap.org/data/2.5/weather?q=bratslav
    
    Retrieving weather data for concordia (3435261)
    api.openweathermap.org/data/2.5/weather?q=concordia
    
    Retrieving weather data for san quintin (1688687)
    api.openweathermap.org/data/2.5/weather?q=san quintin
    
    Retrieving weather data for komatipoort (988290)
    api.openweathermap.org/data/2.5/weather?q=komatipoort
    
    Retrieving weather data for gazli (1513990)
    api.openweathermap.org/data/2.5/weather?q=gazli
    
    Retrieving weather data for ucluelet (6171633)
    api.openweathermap.org/data/2.5/weather?q=ucluelet
    
    Retrieving weather data for sao joao da barra (3448903)
    api.openweathermap.org/data/2.5/weather?q=sao joao da barra
    
    Retrieving weather data for rawson (3839307)
    api.openweathermap.org/data/2.5/weather?q=rawson
    
    Retrieving weather data for muros (3115824)
    api.openweathermap.org/data/2.5/weather?q=muros
    
    Retrieving weather data for new waterford (5164449)
    api.openweathermap.org/data/2.5/weather?q=new waterford
    
    Retrieving weather data for kosh-agach (1502422)
    api.openweathermap.org/data/2.5/weather?q=kosh-agach
    
    Retrieving weather data for pierre (5767918)
    api.openweathermap.org/data/2.5/weather?q=pierre
    
    Retrieving weather data for jumla (1283285)
    api.openweathermap.org/data/2.5/weather?q=jumla
    
    Retrieving weather data for cockburn town (3576994)
    api.openweathermap.org/data/2.5/weather?q=cockburn town
    
    Retrieving weather data for qaqortoq (3420846)
    api.openweathermap.org/data/2.5/weather?q=qaqortoq
    
    Retrieving weather data for mzimba (925498)
    api.openweathermap.org/data/2.5/weather?q=mzimba
    
    Retrieving weather data for sorland (3137469)
    api.openweathermap.org/data/2.5/weather?q=sorland
    
    Retrieving weather data for dubbo (2168305)
    api.openweathermap.org/data/2.5/weather?q=dubbo
    
    Retrieving weather data for abalak (2448245)
    api.openweathermap.org/data/2.5/weather?q=abalak
    
    Exception: lolua is not in OWM database.
    
    Retrieving weather data for innisfail (5983430)
    api.openweathermap.org/data/2.5/weather?q=innisfail
    
    Retrieving weather data for esperance (3573739)
    api.openweathermap.org/data/2.5/weather?q=esperance
    
    Retrieving weather data for hami (1529484)
    api.openweathermap.org/data/2.5/weather?q=hami
    
    Retrieving weather data for druzhba (691693)
    api.openweathermap.org/data/2.5/weather?q=druzhba
    
    Retrieving weather data for sturgis (5769489)
    api.openweathermap.org/data/2.5/weather?q=sturgis
    
    Retrieving weather data for entre rios (3464100)
    api.openweathermap.org/data/2.5/weather?q=entre rios
    
    Retrieving weather data for khatanga (2022572)
    api.openweathermap.org/data/2.5/weather?q=khatanga
    
    Retrieving weather data for kahului (5847411)
    api.openweathermap.org/data/2.5/weather?q=kahului
    
    Exception: phan rang is not in OWM database.
    
    Retrieving weather data for port pirie (2063030)
    api.openweathermap.org/data/2.5/weather?q=port pirie
    
    Retrieving weather data for inta (1505579)
    api.openweathermap.org/data/2.5/weather?q=inta
    
    Retrieving weather data for the valley (3573374)
    api.openweathermap.org/data/2.5/weather?q=the valley
    
    Retrieving weather data for boende (218680)
    api.openweathermap.org/data/2.5/weather?q=boende
    
    Retrieving weather data for bandarbeyla (64814)
    api.openweathermap.org/data/2.5/weather?q=bandarbeyla
    
    Retrieving weather data for marfino (503977)
    api.openweathermap.org/data/2.5/weather?q=marfino
    
    Retrieving weather data for norcasia (3673811)
    api.openweathermap.org/data/2.5/weather?q=norcasia
    
    Retrieving weather data for victoria (1733782)
    api.openweathermap.org/data/2.5/weather?q=victoria
    
    Retrieving weather data for pozo colorado (3437443)
    api.openweathermap.org/data/2.5/weather?q=pozo colorado
    
    Retrieving weather data for nosy varika (1058080)
    api.openweathermap.org/data/2.5/weather?q=nosy varika
    
    Retrieving weather data for roma (6539761)
    api.openweathermap.org/data/2.5/weather?q=roma
    
    Retrieving weather data for hetauda (1283339)
    api.openweathermap.org/data/2.5/weather?q=hetauda
    
    Retrieving weather data for hervey bay (2146219)
    api.openweathermap.org/data/2.5/weather?q=hervey bay
    
    Retrieving weather data for husavik (5961417)
    api.openweathermap.org/data/2.5/weather?q=husavik
    
    Exception: sentyabrskiy is not in OWM database.
    
    Retrieving weather data for hobart (2163355)
    api.openweathermap.org/data/2.5/weather?q=hobart
    
    Retrieving weather data for beipiao (2038342)
    api.openweathermap.org/data/2.5/weather?q=beipiao
    
    Retrieving weather data for necochea (3430443)
    api.openweathermap.org/data/2.5/weather?q=necochea
    
    Retrieving weather data for keuruu (652977)
    api.openweathermap.org/data/2.5/weather?q=keuruu
    
    Retrieving weather data for najran (103630)
    api.openweathermap.org/data/2.5/weather?q=najran
    
    Retrieving weather data for fuyang (1810845)
    api.openweathermap.org/data/2.5/weather?q=fuyang
    
    Retrieving weather data for tonantins (3661894)
    api.openweathermap.org/data/2.5/weather?q=tonantins
    
    Retrieving weather data for bukene (160971)
    api.openweathermap.org/data/2.5/weather?q=bukene
    
    Exception: karamea is not in OWM database.
    
    Retrieving weather data for hobyo (57000)
    api.openweathermap.org/data/2.5/weather?q=hobyo
    
    Retrieving weather data for zhangjiakou (2033196)
    api.openweathermap.org/data/2.5/weather?q=zhangjiakou
    
    Retrieving weather data for kamina (214614)
    api.openweathermap.org/data/2.5/weather?q=kamina
    
    Retrieving weather data for leningradskiy (2123814)
    api.openweathermap.org/data/2.5/weather?q=leningradskiy
    
    Retrieving weather data for norman wells (6089245)
    api.openweathermap.org/data/2.5/weather?q=norman wells
    
    Retrieving weather data for zaranj (1120985)
    api.openweathermap.org/data/2.5/weather?q=zaranj
    
    Retrieving weather data for faya (110690)
    api.openweathermap.org/data/2.5/weather?q=faya
    
    Retrieving weather data for thompson (6165406)
    api.openweathermap.org/data/2.5/weather?q=thompson
    
    Exception: meyungs is not in OWM database.
    
    Retrieving weather data for dharchula (1272864)
    api.openweathermap.org/data/2.5/weather?q=dharchula
    
    Retrieving weather data for luau (876177)
    api.openweathermap.org/data/2.5/weather?q=luau
    
    Retrieving weather data for yichang (1786764)
    api.openweathermap.org/data/2.5/weather?q=yichang
    
    Retrieving weather data for mar del plata (3863379)
    api.openweathermap.org/data/2.5/weather?q=mar del plata
    
    Retrieving weather data for fujin (2037375)
    api.openweathermap.org/data/2.5/weather?q=fujin
    
    Retrieving weather data for unity (6172009)
    api.openweathermap.org/data/2.5/weather?q=unity
    
    Retrieving weather data for araouane (2460954)
    api.openweathermap.org/data/2.5/weather?q=araouane
    
    Retrieving weather data for usinsk (863061)
    api.openweathermap.org/data/2.5/weather?q=usinsk
    
    Retrieving weather data for penzance (2640377)
    api.openweathermap.org/data/2.5/weather?q=penzance
    
    Retrieving weather data for macheng (1801582)
    api.openweathermap.org/data/2.5/weather?q=macheng
    
    Retrieving weather data for adrar (2508813)
    api.openweathermap.org/data/2.5/weather?q=adrar
    
    Retrieving weather data for padang (1633419)
    api.openweathermap.org/data/2.5/weather?q=padang
    
    Retrieving weather data for souillac (3026644)
    api.openweathermap.org/data/2.5/weather?q=souillac
    
    Retrieving weather data for amos (5884588)
    api.openweathermap.org/data/2.5/weather?q=amos
    
    Retrieving weather data for zhangye (1785036)
    api.openweathermap.org/data/2.5/weather?q=zhangye
    
    Retrieving weather data for hof (2902768)
    api.openweathermap.org/data/2.5/weather?q=hof
    
    Retrieving weather data for quchan (119115)
    api.openweathermap.org/data/2.5/weather?q=quchan
    
    Retrieving weather data for cherskiy (2126199)
    api.openweathermap.org/data/2.5/weather?q=cherskiy
    
    Retrieving weather data for dikson (1507390)
    api.openweathermap.org/data/2.5/weather?q=dikson
    
    Retrieving weather data for la ronge (6050066)
    api.openweathermap.org/data/2.5/weather?q=la ronge
    
    Retrieving weather data for ahipara (2194098)
    api.openweathermap.org/data/2.5/weather?q=ahipara
    
    Retrieving weather data for ribeirao bonito (3451363)
    api.openweathermap.org/data/2.5/weather?q=ribeirao bonito
    
    Retrieving weather data for bow island (5906757)
    api.openweathermap.org/data/2.5/weather?q=bow island
    
    Exception: bolshoye sorokino is not in OWM database.
    
    Retrieving weather data for celestun (3531368)
    api.openweathermap.org/data/2.5/weather?q=celestun
    
    Retrieving weather data for sterling (4787534)
    api.openweathermap.org/data/2.5/weather?q=sterling
    
    Retrieving weather data for choix (4014109)
    api.openweathermap.org/data/2.5/weather?q=choix
    
    Exception: achiotal is not in OWM database.
    
    Retrieving weather data for handan (1808963)
    api.openweathermap.org/data/2.5/weather?q=handan
    
    Retrieving weather data for kentau (1522751)
    api.openweathermap.org/data/2.5/weather?q=kentau
    
    Exception: atka is not in OWM database.
    
    Exception: sahrak is not in OWM database.
    
    Exception: attawapiskat is not in OWM database.
    
    Retrieving weather data for kudahuvadhoo (1337607)
    api.openweathermap.org/data/2.5/weather?q=kudahuvadhoo
    
    Retrieving weather data for menongue (3347353)
    api.openweathermap.org/data/2.5/weather?q=menongue
    
    Retrieving weather data for saint-pierre (2995603)
    api.openweathermap.org/data/2.5/weather?q=saint-pierre
    
    Retrieving weather data for pavlovsk (1495448)
    api.openweathermap.org/data/2.5/weather?q=pavlovsk
    
    Retrieving weather data for byron bay (2172880)
    api.openweathermap.org/data/2.5/weather?q=byron bay
    
    Retrieving weather data for itupiranga (3397851)
    api.openweathermap.org/data/2.5/weather?q=itupiranga
    
    Retrieving weather data for emerald (2167426)
    api.openweathermap.org/data/2.5/weather?q=emerald
    
    Retrieving weather data for aripuana (3665202)
    api.openweathermap.org/data/2.5/weather?q=aripuana
    
    Retrieving weather data for kalevala (650705)
    api.openweathermap.org/data/2.5/weather?q=kalevala
    
    Retrieving weather data for valdivia (3868707)
    api.openweathermap.org/data/2.5/weather?q=valdivia
    
    Retrieving weather data for katangli (2122783)
    api.openweathermap.org/data/2.5/weather?q=katangli
    
    Retrieving weather data for half moon bay (5354943)
    api.openweathermap.org/data/2.5/weather?q=half moon bay
    
    Retrieving weather data for grand gaube (934479)
    api.openweathermap.org/data/2.5/weather?q=grand gaube
    
    Retrieving weather data for port macquarie (2152659)
    api.openweathermap.org/data/2.5/weather?q=port macquarie
    
    Retrieving weather data for madikeri (1264540)
    api.openweathermap.org/data/2.5/weather?q=madikeri
    
    Exception: krasnoselkup is not in OWM database.
    
    Retrieving weather data for yar-sale (1486321)
    api.openweathermap.org/data/2.5/weather?q=yar-sale
    
    Retrieving weather data for saint-leu (6690297)
    api.openweathermap.org/data/2.5/weather?q=saint-leu
    
    Exception: nguiu is not in OWM database.
    
    Retrieving weather data for san cristobal (3652462)
    api.openweathermap.org/data/2.5/weather?q=san cristobal
    
    Retrieving weather data for bubaque (2374583)
    api.openweathermap.org/data/2.5/weather?q=bubaque
    
    Retrieving weather data for svetlogorsk (584051)
    api.openweathermap.org/data/2.5/weather?q=svetlogorsk
    
    Retrieving weather data for thunder bay (6166142)
    api.openweathermap.org/data/2.5/weather?q=thunder bay
    
    Retrieving weather data for wilmington (4145381)
    api.openweathermap.org/data/2.5/weather?q=wilmington
    
    Retrieving weather data for carutapera (3402648)
    api.openweathermap.org/data/2.5/weather?q=carutapera
    
    Retrieving weather data for genhe (2037252)
    api.openweathermap.org/data/2.5/weather?q=genhe
    
    Retrieving weather data for atbasar (1526038)
    api.openweathermap.org/data/2.5/weather?q=atbasar
    
    Retrieving weather data for matozinhos (3457393)
    api.openweathermap.org/data/2.5/weather?q=matozinhos
    
    Retrieving weather data for sao felix do xingu (3388847)
    api.openweathermap.org/data/2.5/weather?q=sao felix do xingu
    
    Retrieving weather data for maldonado (3441894)
    api.openweathermap.org/data/2.5/weather?q=maldonado
    
    Retrieving weather data for baragua (3567823)
    api.openweathermap.org/data/2.5/weather?q=baragua
    
    Retrieving weather data for xining (1788852)
    api.openweathermap.org/data/2.5/weather?q=xining
    
    Retrieving weather data for viseu (2732265)
    api.openweathermap.org/data/2.5/weather?q=viseu
    
    Retrieving weather data for guisa (3557332)
    api.openweathermap.org/data/2.5/weather?q=guisa
    
    Exception: macaboboni is not in OWM database.
    
    Retrieving weather data for baykit (1510689)
    api.openweathermap.org/data/2.5/weather?q=baykit
    
    Retrieving weather data for kargasok (1504382)
    api.openweathermap.org/data/2.5/weather?q=kargasok
    
    Exception: addis zemen is not in OWM database.
    
    Retrieving weather data for bakel (2252606)
    api.openweathermap.org/data/2.5/weather?q=bakel
    
    Exception: maridi is not in OWM database.
    
    Retrieving weather data for yeppoon (2142316)
    api.openweathermap.org/data/2.5/weather?q=yeppoon
    
    Retrieving weather data for tuatapere (2180815)
    api.openweathermap.org/data/2.5/weather?q=tuatapere
    
    Retrieving weather data for avera (4231997)
    api.openweathermap.org/data/2.5/weather?q=avera
    
    Retrieving weather data for ostrovnoy (556268)
    api.openweathermap.org/data/2.5/weather?q=ostrovnoy
    
    Retrieving weather data for wesley (6232243)
    api.openweathermap.org/data/2.5/weather?q=wesley
    
    Retrieving weather data for ancud (3899695)
    api.openweathermap.org/data/2.5/weather?q=ancud
    
    Exception: scottsburgh is not in OWM database.
    
    Retrieving weather data for springfield (4409896)
    api.openweathermap.org/data/2.5/weather?q=springfield
    
    Retrieving weather data for lamu (1623890)
    api.openweathermap.org/data/2.5/weather?q=lamu
    
    Retrieving weather data for katsuura (1865309)
    api.openweathermap.org/data/2.5/weather?q=katsuura
    
    Retrieving weather data for shingu (1847947)
    api.openweathermap.org/data/2.5/weather?q=shingu
    
    Exception: jabiru is not in OWM database.
    
    Retrieving weather data for ejura (2301217)
    api.openweathermap.org/data/2.5/weather?q=ejura
    
    Retrieving weather data for alexandria (4314550)
    api.openweathermap.org/data/2.5/weather?q=alexandria
    
    Retrieving weather data for dancheng (1813892)
    api.openweathermap.org/data/2.5/weather?q=dancheng
    
    Retrieving weather data for clyde river (5924351)
    api.openweathermap.org/data/2.5/weather?q=clyde river
    
    Retrieving weather data for canberra (2172517)
    api.openweathermap.org/data/2.5/weather?q=canberra
    
    Retrieving weather data for petropavlovsk-kamchatskiy (2122104)
    api.openweathermap.org/data/2.5/weather?q=petropavlovsk-kamchatskiy
    
    Retrieving weather data for cabedelo (3404558)
    api.openweathermap.org/data/2.5/weather?q=cabedelo
    
    Exception: zlatoustovsk is not in OWM database.
    
    Retrieving weather data for vostok (2013279)
    api.openweathermap.org/data/2.5/weather?q=vostok
    
    Retrieving weather data for fallon (5681948)
    api.openweathermap.org/data/2.5/weather?q=fallon
    
    Retrieving weather data for marawi (1701054)
    api.openweathermap.org/data/2.5/weather?q=marawi
    
    Retrieving weather data for bahia blanca (3865086)
    api.openweathermap.org/data/2.5/weather?q=bahia blanca
    
    Retrieving weather data for pangai (4032369)
    api.openweathermap.org/data/2.5/weather?q=pangai
    
    Retrieving weather data for saint-francois (2980080)
    api.openweathermap.org/data/2.5/weather?q=saint-francois
    
    Retrieving weather data for mount gambier (2156643)
    api.openweathermap.org/data/2.5/weather?q=mount gambier
    
    Retrieving weather data for nalut (2214433)
    api.openweathermap.org/data/2.5/weather?q=nalut
    
    Retrieving weather data for ekhabi (2122614)
    api.openweathermap.org/data/2.5/weather?q=ekhabi
    
    Retrieving weather data for bathsheba (3374083)
    api.openweathermap.org/data/2.5/weather?q=bathsheba
    
    Retrieving weather data for bowen (2174444)
    api.openweathermap.org/data/2.5/weather?q=bowen
    
    Retrieving weather data for zverinogolovskoye (1484943)
    api.openweathermap.org/data/2.5/weather?q=zverinogolovskoye
    
    Retrieving weather data for riyadh (108410)
    api.openweathermap.org/data/2.5/weather?q=riyadh
    
    Retrieving weather data for teya (3526662)
    api.openweathermap.org/data/2.5/weather?q=teya
    
    Retrieving weather data for sungairaya (1625908)
    api.openweathermap.org/data/2.5/weather?q=sungairaya
    
    Retrieving weather data for port-cartier (6111696)
    api.openweathermap.org/data/2.5/weather?q=port-cartier
    
    Retrieving weather data for narsaq (3421719)
    api.openweathermap.org/data/2.5/weather?q=narsaq
    
    Retrieving weather data for casablanca (2553604)
    api.openweathermap.org/data/2.5/weather?q=casablanca
    
    Retrieving weather data for urubicha (3923644)
    api.openweathermap.org/data/2.5/weather?q=urubicha
    
    Retrieving weather data for puquio (3931223)
    api.openweathermap.org/data/2.5/weather?q=puquio
    
    Exception: saleaula is not in OWM database.
    
    Retrieving weather data for ulaangom (1515029)
    api.openweathermap.org/data/2.5/weather?q=ulaangom
    
    Retrieving weather data for helong (1808534)
    api.openweathermap.org/data/2.5/weather?q=helong
    
    Retrieving weather data for pontian kecil (1732711)
    api.openweathermap.org/data/2.5/weather?q=pontian kecil
    
    Retrieving weather data for kihei (5849297)
    api.openweathermap.org/data/2.5/weather?q=kihei
    
    Retrieving weather data for erenhot (2037485)
    api.openweathermap.org/data/2.5/weather?q=erenhot
    
    Exception: sao miguel do oeste is not in OWM database.
    
    Retrieving weather data for tigzirt (2504703)
    api.openweathermap.org/data/2.5/weather?q=tigzirt
    
    Retrieving weather data for prince rupert (6113406)
    api.openweathermap.org/data/2.5/weather?q=prince rupert
    
    Retrieving weather data for ibiapina (3398408)
    api.openweathermap.org/data/2.5/weather?q=ibiapina
    
    Retrieving weather data for batagay-alyta (2027042)
    api.openweathermap.org/data/2.5/weather?q=batagay-alyta
    
    Retrieving weather data for hilotongan (1711738)
    api.openweathermap.org/data/2.5/weather?q=hilotongan
    
    Retrieving weather data for cascais (2269594)
    api.openweathermap.org/data/2.5/weather?q=cascais
    
    Retrieving weather data for saquena (3692020)
    api.openweathermap.org/data/2.5/weather?q=saquena
    
    Retrieving weather data for geraldton (5960603)
    api.openweathermap.org/data/2.5/weather?q=geraldton
    
    Exception: porto santo is not in OWM database.
    
    Exception: itaobim is not in OWM database.
    
    Retrieving weather data for mangrol (1263751)
    api.openweathermap.org/data/2.5/weather?q=mangrol
    
    Retrieving weather data for nanortalik (3421765)
    api.openweathermap.org/data/2.5/weather?q=nanortalik
    
    Retrieving weather data for vestmannaeyjar (3412093)
    api.openweathermap.org/data/2.5/weather?q=vestmannaeyjar
    
    Retrieving weather data for ahuimanu (5856516)
    api.openweathermap.org/data/2.5/weather?q=ahuimanu
    
    Retrieving weather data for santander jimenez (3517151)
    api.openweathermap.org/data/2.5/weather?q=santander jimenez
    
    Retrieving weather data for muret (2991153)
    api.openweathermap.org/data/2.5/weather?q=muret
    
    Retrieving weather data for copiapo (3893656)
    api.openweathermap.org/data/2.5/weather?q=copiapo
    
    Retrieving weather data for bethel (5880568)
    api.openweathermap.org/data/2.5/weather?q=bethel
    
    Exception: tabulbah is not in OWM database.
    
    Retrieving weather data for central point (5718601)
    api.openweathermap.org/data/2.5/weather?q=central point
    
    Retrieving weather data for ishigaki (1861416)
    api.openweathermap.org/data/2.5/weather?q=ishigaki
    
    Retrieving weather data for nara (1855612)
    api.openweathermap.org/data/2.5/weather?q=nara
    
    Retrieving weather data for ambilobe (1082243)
    api.openweathermap.org/data/2.5/weather?q=ambilobe
    
    Retrieving weather data for kampong thum (1831125)
    api.openweathermap.org/data/2.5/weather?q=kampong thum
    
    Exception: gilgil is not in OWM database.
    
    Retrieving weather data for berthierville (5899017)
    api.openweathermap.org/data/2.5/weather?q=berthierville
    
    Retrieving weather data for barbacoas (3689228)
    api.openweathermap.org/data/2.5/weather?q=barbacoas
    
    Retrieving weather data for ust-nera (2120048)
    api.openweathermap.org/data/2.5/weather?q=ust-nera
    
    Retrieving weather data for jacmel (3723779)
    api.openweathermap.org/data/2.5/weather?q=jacmel
    
    Exception: asfi is not in OWM database.
    
    Retrieving weather data for dutlwe (933787)
    api.openweathermap.org/data/2.5/weather?q=dutlwe
    
    Retrieving weather data for road town (3577430)
    api.openweathermap.org/data/2.5/weather?q=road town
    
    Retrieving weather data for alekseyevka (548625)
    api.openweathermap.org/data/2.5/weather?q=alekseyevka
    
    Retrieving weather data for wairoa (2206808)
    api.openweathermap.org/data/2.5/weather?q=wairoa
    
    Retrieving weather data for ust-kut (2013923)
    api.openweathermap.org/data/2.5/weather?q=ust-kut
    
    Retrieving weather data for nelson bay (2155562)
    api.openweathermap.org/data/2.5/weather?q=nelson bay
    
    Retrieving weather data for daru (2409663)
    api.openweathermap.org/data/2.5/weather?q=daru
    
    Retrieving weather data for ryde (2638911)
    api.openweathermap.org/data/2.5/weather?q=ryde
    
    Retrieving weather data for tyrma (2014694)
    api.openweathermap.org/data/2.5/weather?q=tyrma
    
    Retrieving weather data for sanmenxia (1796669)
    api.openweathermap.org/data/2.5/weather?q=sanmenxia
    
    Retrieving weather data for chulman (2025261)
    api.openweathermap.org/data/2.5/weather?q=chulman
    
    Retrieving weather data for nouakchott (2377450)
    api.openweathermap.org/data/2.5/weather?q=nouakchott
    
    Retrieving weather data for gat (2249901)
    api.openweathermap.org/data/2.5/weather?q=gat
    
    Retrieving weather data for birin (170017)
    api.openweathermap.org/data/2.5/weather?q=birin
    
    Retrieving weather data for mnogovershinnyy (2019935)
    api.openweathermap.org/data/2.5/weather?q=mnogovershinnyy
    
    Retrieving weather data for buala (2109528)
    api.openweathermap.org/data/2.5/weather?q=buala
    
    Retrieving weather data for makarov (2123614)
    api.openweathermap.org/data/2.5/weather?q=makarov
    
    Retrieving weather data for baiquan (2038541)
    api.openweathermap.org/data/2.5/weather?q=baiquan
    
    Retrieving weather data for sistranda (3139597)
    api.openweathermap.org/data/2.5/weather?q=sistranda
    
    Retrieving weather data for sao filipe (3374210)
    api.openweathermap.org/data/2.5/weather?q=sao filipe
    
    Retrieving weather data for alofi (4036284)
    api.openweathermap.org/data/2.5/weather?q=alofi
    
    Retrieving weather data for waggaman (4344819)
    api.openweathermap.org/data/2.5/weather?q=waggaman
    
    Retrieving weather data for tocopilla (3869716)
    api.openweathermap.org/data/2.5/weather?q=tocopilla
    
    Exception: marmaron is not in OWM database.
    
    Retrieving weather data for tottori (1849892)
    api.openweathermap.org/data/2.5/weather?q=tottori
    
    Retrieving weather data for san julian (3583102)
    api.openweathermap.org/data/2.5/weather?q=san julian
    
    Retrieving weather data for ozinki (513328)
    api.openweathermap.org/data/2.5/weather?q=ozinki
    
    Retrieving weather data for stanislav (692944)
    api.openweathermap.org/data/2.5/weather?q=stanislav
    
    Retrieving weather data for hukuntsi (933726)
    api.openweathermap.org/data/2.5/weather?q=hukuntsi
    
    Retrieving weather data for nchelenge (175499)
    api.openweathermap.org/data/2.5/weather?q=nchelenge
    
    Retrieving weather data for tacoronte (2510725)
    api.openweathermap.org/data/2.5/weather?q=tacoronte
    
    Retrieving weather data for am timan (245338)
    api.openweathermap.org/data/2.5/weather?q=am timan
    
    Retrieving weather data for presidente medici (3924872)
    api.openweathermap.org/data/2.5/weather?q=presidente medici
    
    Retrieving weather data for west richland (5815599)
    api.openweathermap.org/data/2.5/weather?q=west richland
    
    Retrieving weather data for lannion (3007609)
    api.openweathermap.org/data/2.5/weather?q=lannion
    
    Retrieving weather data for dali (1814093)
    api.openweathermap.org/data/2.5/weather?q=dali
    
    Retrieving weather data for nokaneng (933211)
    api.openweathermap.org/data/2.5/weather?q=nokaneng
    
    Retrieving weather data for san carlos de bariloche (7647007)
    api.openweathermap.org/data/2.5/weather?q=san carlos de bariloche
    
    Retrieving weather data for klin (547523)
    api.openweathermap.org/data/2.5/weather?q=klin
    
    Retrieving weather data for muroto (1856392)
    api.openweathermap.org/data/2.5/weather?q=muroto
    
    Retrieving weather data for saint-augustin (3031582)
    api.openweathermap.org/data/2.5/weather?q=saint-augustin
    
    Exception: khonuu is not in OWM database.
    
    Retrieving weather data for coahuayana (3981460)
    api.openweathermap.org/data/2.5/weather?q=coahuayana
    
    Exception: cagayan de tawi-tawi is not in OWM database.
    
    Retrieving weather data for high prairie (5975034)
    api.openweathermap.org/data/2.5/weather?q=high prairie
    
    Retrieving weather data for merauke (2082539)
    api.openweathermap.org/data/2.5/weather?q=merauke
    
    Retrieving weather data for kirakira (2178753)
    api.openweathermap.org/data/2.5/weather?q=kirakira
    
    Retrieving weather data for lasa (146639)
    api.openweathermap.org/data/2.5/weather?q=lasa
    
    Retrieving weather data for sosnovo-ozerskoye (2016216)
    api.openweathermap.org/data/2.5/weather?q=sosnovo-ozerskoye
    
    Retrieving weather data for morant bay (3489440)
    api.openweathermap.org/data/2.5/weather?q=morant bay
    
    Exception: grajau is not in OWM database.
    
    Retrieving weather data for roseburg (5749352)
    api.openweathermap.org/data/2.5/weather?q=roseburg
    
    Retrieving weather data for san patricio (3437029)
    api.openweathermap.org/data/2.5/weather?q=san patricio
    
    Retrieving weather data for rocha (3440777)
    api.openweathermap.org/data/2.5/weather?q=rocha
    
    Retrieving weather data for jodhpur (1268865)
    api.openweathermap.org/data/2.5/weather?q=jodhpur
    
    Retrieving weather data for halmstad (2708365)
    api.openweathermap.org/data/2.5/weather?q=halmstad
    
    Retrieving weather data for puyang (1798422)
    api.openweathermap.org/data/2.5/weather?q=puyang
    
    Exception: tukrah is not in OWM database.
    
    Retrieving weather data for ketchikan (5554428)
    api.openweathermap.org/data/2.5/weather?q=ketchikan
    
    Retrieving weather data for ust-maya (2013918)
    api.openweathermap.org/data/2.5/weather?q=ust-maya
    
    Retrieving weather data for inhambane (1045114)
    api.openweathermap.org/data/2.5/weather?q=inhambane
    
    Retrieving weather data for fairview (5097801)
    api.openweathermap.org/data/2.5/weather?q=fairview
    
    Exception: makung is not in OWM database.
    
    Retrieving weather data for masyaf (167046)
    api.openweathermap.org/data/2.5/weather?q=masyaf
    
    Retrieving weather data for flinders (6255012)
    api.openweathermap.org/data/2.5/weather?q=flinders
    
    Retrieving weather data for quixeramobim (3390901)
    api.openweathermap.org/data/2.5/weather?q=quixeramobim
    
    Retrieving weather data for ulladulla (2145554)
    api.openweathermap.org/data/2.5/weather?q=ulladulla
    
    Retrieving weather data for cusset (3021993)
    api.openweathermap.org/data/2.5/weather?q=cusset
    
    Retrieving weather data for dale (1805323)
    api.openweathermap.org/data/2.5/weather?q=dale
    
    Retrieving weather data for arman (2127060)
    api.openweathermap.org/data/2.5/weather?q=arman
    
    Retrieving weather data for fatsa (747155)
    api.openweathermap.org/data/2.5/weather?q=fatsa
    
    Retrieving weather data for laguna (4013704)
    api.openweathermap.org/data/2.5/weather?q=laguna
    
    Retrieving weather data for indianola (5697383)
    api.openweathermap.org/data/2.5/weather?q=indianola
    
    Retrieving weather data for tarakan (1624725)
    api.openweathermap.org/data/2.5/weather?q=tarakan
    
    Retrieving weather data for lorengau (2092164)
    api.openweathermap.org/data/2.5/weather?q=lorengau
    
    Retrieving weather data for ilhabela (3461425)
    api.openweathermap.org/data/2.5/weather?q=ilhabela
    
    Retrieving weather data for banjar (1650233)
    api.openweathermap.org/data/2.5/weather?q=banjar
    
    Retrieving weather data for vitina (727030)
    api.openweathermap.org/data/2.5/weather?q=vitina
    
    Retrieving weather data for kiri buru (1266503)
    api.openweathermap.org/data/2.5/weather?q=kiri buru
    
    Retrieving weather data for kuju (1265773)
    api.openweathermap.org/data/2.5/weather?q=kuju
    
    Retrieving weather data for havoysund (779622)
    api.openweathermap.org/data/2.5/weather?q=havoysund
    
    Retrieving weather data for jega (2336237)
    api.openweathermap.org/data/2.5/weather?q=jega
    
    Retrieving weather data for tsalenjikha (611551)
    api.openweathermap.org/data/2.5/weather?q=tsalenjikha
    
    Retrieving weather data for glyadyanskoye (1506499)
    api.openweathermap.org/data/2.5/weather?q=glyadyanskoye
    
    Retrieving weather data for milkovo (727030)
    api.openweathermap.org/data/2.5/weather?q=milkovo
    
    Retrieving weather data for fort-shevchenko (609906)
    api.openweathermap.org/data/2.5/weather?q=fort-shevchenko
    
    Retrieving weather data for izumo (1861084)
    api.openweathermap.org/data/2.5/weather?q=izumo
    
    Retrieving weather data for molokovo (525509)
    api.openweathermap.org/data/2.5/weather?q=molokovo
    
    Retrieving weather data for kiunga (2093846)
    api.openweathermap.org/data/2.5/weather?q=kiunga
    
    Retrieving weather data for grasse (6454920)
    api.openweathermap.org/data/2.5/weather?q=grasse
    
    Retrieving weather data for severo-kurilsk (2121385)
    api.openweathermap.org/data/2.5/weather?q=severo-kurilsk
    
    Exception: wahran is not in OWM database.
    
    Retrieving weather data for nefteyugansk (1497917)
    api.openweathermap.org/data/2.5/weather?q=nefteyugansk
    
    Retrieving weather data for quelimane (1028434)
    api.openweathermap.org/data/2.5/weather?q=quelimane
    
    Retrieving weather data for gillette (5826027)
    api.openweathermap.org/data/2.5/weather?q=gillette
    
    Retrieving weather data for port hawkesbury (6111867)
    api.openweathermap.org/data/2.5/weather?q=port hawkesbury
    
    Retrieving weather data for harper (4696310)
    api.openweathermap.org/data/2.5/weather?q=harper
    
    Retrieving weather data for tebingtinggi (1213500)
    api.openweathermap.org/data/2.5/weather?q=tebingtinggi
    
    Retrieving weather data for luena (3347719)
    api.openweathermap.org/data/2.5/weather?q=luena
    
    Retrieving weather data for grogol (1630798)
    api.openweathermap.org/data/2.5/weather?q=grogol
    
    Retrieving weather data for khanpur (1174167)
    api.openweathermap.org/data/2.5/weather?q=khanpur
    
    Retrieving weather data for ko samui (1154689)
    api.openweathermap.org/data/2.5/weather?q=ko samui
    
    Retrieving weather data for rorvik (3141310)
    api.openweathermap.org/data/2.5/weather?q=rorvik
    
    Retrieving weather data for kilembe (231250)
    api.openweathermap.org/data/2.5/weather?q=kilembe
    
    Retrieving weather data for eastbourne (1022391)
    api.openweathermap.org/data/2.5/weather?q=eastbourne
    
    Retrieving weather data for aki (1865449)
    api.openweathermap.org/data/2.5/weather?q=aki
    
    Retrieving weather data for flin flon (5954718)
    api.openweathermap.org/data/2.5/weather?q=flin flon
    
    Retrieving weather data for sur (286245)
    api.openweathermap.org/data/2.5/weather?q=sur
    
    Retrieving weather data for deputatskiy (2028164)
    api.openweathermap.org/data/2.5/weather?q=deputatskiy
    
    Retrieving weather data for salalah (286621)
    api.openweathermap.org/data/2.5/weather?q=salalah
    
    Retrieving weather data for palafrugell (3114567)
    api.openweathermap.org/data/2.5/weather?q=palafrugell
    
    Retrieving weather data for port blair (1259385)
    api.openweathermap.org/data/2.5/weather?q=port blair
    
    Retrieving weather data for imbituba (3461370)
    api.openweathermap.org/data/2.5/weather?q=imbituba
    
    Retrieving weather data for kieta (2094027)
    api.openweathermap.org/data/2.5/weather?q=kieta
    
    Retrieving weather data for mogadouro (2737599)
    api.openweathermap.org/data/2.5/weather?q=mogadouro
    
    Retrieving weather data for gilbues (3398931)
    api.openweathermap.org/data/2.5/weather?q=gilbues
    
    Retrieving weather data for chapais (5919850)
    api.openweathermap.org/data/2.5/weather?q=chapais
    
    Exception: pousat is not in OWM database.
    
    Retrieving weather data for ola (2122574)
    api.openweathermap.org/data/2.5/weather?q=ola
    
    Exception: samusu is not in OWM database.
    
    Retrieving weather data for saint-georges (6295855)
    api.openweathermap.org/data/2.5/weather?q=saint-georges
    
    Exception: gurskoye is not in OWM database.
    
    Retrieving weather data for ivdel (1505260)
    api.openweathermap.org/data/2.5/weather?q=ivdel
    
    Retrieving weather data for pangoa (3933104)
    api.openweathermap.org/data/2.5/weather?q=pangoa
    
    Retrieving weather data for zhezkazgan (1516589)
    api.openweathermap.org/data/2.5/weather?q=zhezkazgan
    
    Retrieving weather data for solnechnogorsk (490996)
    api.openweathermap.org/data/2.5/weather?q=solnechnogorsk
    
    Retrieving weather data for bukachacha (2026023)
    api.openweathermap.org/data/2.5/weather?q=bukachacha
    
    Retrieving weather data for yulara (6355222)
    api.openweathermap.org/data/2.5/weather?q=yulara
    
    Retrieving weather data for boden (606531)
    api.openweathermap.org/data/2.5/weather?q=boden
    
    Exception: mrirt is not in OWM database.
    
    Retrieving weather data for novyy svit (698861)
    api.openweathermap.org/data/2.5/weather?q=novyy svit
    
    Retrieving weather data for kumylzhenskaya (539221)
    api.openweathermap.org/data/2.5/weather?q=kumylzhenskaya
    
    Retrieving weather data for esterhazy (5949563)
    api.openweathermap.org/data/2.5/weather?q=esterhazy
    
    Retrieving weather data for nago (3172402)
    api.openweathermap.org/data/2.5/weather?q=nago
    
    Retrieving weather data for berezovyy (2026786)
    api.openweathermap.org/data/2.5/weather?q=berezovyy
    
    Retrieving weather data for benghazi (88319)
    api.openweathermap.org/data/2.5/weather?q=benghazi
    
    Retrieving weather data for biharamulo (161154)
    api.openweathermap.org/data/2.5/weather?q=biharamulo
    
    Retrieving weather data for codrington (2160063)
    api.openweathermap.org/data/2.5/weather?q=codrington
    
    Retrieving weather data for bolshevik (625144)
    api.openweathermap.org/data/2.5/weather?q=bolshevik
    
    Retrieving weather data for kirkland lake (5992836)
    api.openweathermap.org/data/2.5/weather?q=kirkland lake
    
    Retrieving weather data for zhigansk (2012530)
    api.openweathermap.org/data/2.5/weather?q=zhigansk
    
    Retrieving weather data for boone (4456703)
    api.openweathermap.org/data/2.5/weather?q=boone
    
    Retrieving weather data for gazojak (1514792)
    api.openweathermap.org/data/2.5/weather?q=gazojak
    
    Retrieving weather data for porto torres (3170069)
    api.openweathermap.org/data/2.5/weather?q=porto torres
    
    Retrieving weather data for dunedin (2191562)
    api.openweathermap.org/data/2.5/weather?q=dunedin
    
    Retrieving weather data for semnan (116402)
    api.openweathermap.org/data/2.5/weather?q=semnan
    
    Retrieving weather data for santa isabel do rio negro (3662489)
    api.openweathermap.org/data/2.5/weather?q=santa isabel do rio negro
    
    Retrieving weather data for doha (290030)
    api.openweathermap.org/data/2.5/weather?q=doha
    
    Retrieving weather data for vardo (4372777)
    api.openweathermap.org/data/2.5/weather?q=vardo
    
    Retrieving weather data for pirogovo (509401)
    api.openweathermap.org/data/2.5/weather?q=pirogovo
    
    Retrieving weather data for aklavik (5882953)
    api.openweathermap.org/data/2.5/weather?q=aklavik
    
    Exception: acarau is not in OWM database.
    
    Exception: rungata is not in OWM database.
    
    Retrieving weather data for fukue (1848373)
    api.openweathermap.org/data/2.5/weather?q=fukue
    
    Retrieving weather data for marica (3457708)
    api.openweathermap.org/data/2.5/weather?q=marica
    
    Retrieving weather data for pisco (3932145)
    api.openweathermap.org/data/2.5/weather?q=pisco
    
    Exception: satitoa is not in OWM database.
    
    Retrieving weather data for la crosse (5258957)
    api.openweathermap.org/data/2.5/weather?q=la crosse
    
    Retrieving weather data for svetlograd (485698)
    api.openweathermap.org/data/2.5/weather?q=svetlograd
    
    Retrieving weather data for hamilton (3573197)
    api.openweathermap.org/data/2.5/weather?q=hamilton
    
    Retrieving weather data for omboue (2396853)
    api.openweathermap.org/data/2.5/weather?q=omboue
    
    Exception: sakakah is not in OWM database.
    
    Retrieving weather data for juneau (5554072)
    api.openweathermap.org/data/2.5/weather?q=juneau
    
    Retrieving weather data for nantucket (4944903)
    api.openweathermap.org/data/2.5/weather?q=nantucket
    
    Retrieving weather data for nizhniy tsasuchey (2019118)
    api.openweathermap.org/data/2.5/weather?q=nizhniy tsasuchey
    
    Exception: sinjah is not in OWM database.
    
    Retrieving weather data for westport (2960970)
    api.openweathermap.org/data/2.5/weather?q=westport
    
    Retrieving weather data for ouesso (2255564)
    api.openweathermap.org/data/2.5/weather?q=ouesso
    
    Retrieving weather data for paracuru (3393115)
    api.openweathermap.org/data/2.5/weather?q=paracuru
    
    Retrieving weather data for broome (2656067)
    api.openweathermap.org/data/2.5/weather?q=broome
    
    Retrieving weather data for iguatemi (3461455)
    api.openweathermap.org/data/2.5/weather?q=iguatemi
    
    Retrieving weather data for arlit (2447513)
    api.openweathermap.org/data/2.5/weather?q=arlit
    
    Retrieving weather data for shaoyang (1799462)
    api.openweathermap.org/data/2.5/weather?q=shaoyang
    
    Retrieving weather data for tromso (3133895)
    api.openweathermap.org/data/2.5/weather?q=tromso
    
    Retrieving weather data for camabatela (2242885)
    api.openweathermap.org/data/2.5/weather?q=camabatela
    
    Retrieving weather data for haines junction (5969025)
    api.openweathermap.org/data/2.5/weather?q=haines junction
    
    Retrieving weather data for terrace (6162949)
    api.openweathermap.org/data/2.5/weather?q=terrace
    
    Retrieving weather data for raudeberg (3146487)
    api.openweathermap.org/data/2.5/weather?q=raudeberg
    
    Retrieving weather data for sikasso (2451185)
    api.openweathermap.org/data/2.5/weather?q=sikasso
    
    Retrieving weather data for sobolevo (525426)
    api.openweathermap.org/data/2.5/weather?q=sobolevo
    
    Retrieving weather data for isangel (2136825)
    api.openweathermap.org/data/2.5/weather?q=isangel
    
    Retrieving weather data for roald (3141667)
    api.openweathermap.org/data/2.5/weather?q=roald
    
    Exception: bolvasnita is not in OWM database.
    
    Retrieving weather data for upata (3625710)
    api.openweathermap.org/data/2.5/weather?q=upata
    
    Retrieving weather data for comodoro rivadavia (3860443)
    api.openweathermap.org/data/2.5/weather?q=comodoro rivadavia
    
    Retrieving weather data for manuk mangkaw (1701394)
    api.openweathermap.org/data/2.5/weather?q=manuk mangkaw
    
    Retrieving weather data for abu samrah (172515)
    api.openweathermap.org/data/2.5/weather?q=abu samrah
    
    Retrieving weather data for chirongui (1090415)
    api.openweathermap.org/data/2.5/weather?q=chirongui
    
    Retrieving weather data for darhan (2031964)
    api.openweathermap.org/data/2.5/weather?q=darhan
    
    Retrieving weather data for college (5859699)
    api.openweathermap.org/data/2.5/weather?q=college
    
    Retrieving weather data for stephenville (4734350)
    api.openweathermap.org/data/2.5/weather?q=stephenville
    
    Retrieving weather data for shumikha (1491999)
    api.openweathermap.org/data/2.5/weather?q=shumikha
    
    Retrieving weather data for kinango (191833)
    api.openweathermap.org/data/2.5/weather?q=kinango
    
    Retrieving weather data for mayo (6068416)
    api.openweathermap.org/data/2.5/weather?q=mayo
    
    Retrieving weather data for atar (2381334)
    api.openweathermap.org/data/2.5/weather?q=atar
    
    Retrieving weather data for tual (1623197)
    api.openweathermap.org/data/2.5/weather?q=tual
    
    Retrieving weather data for conde (3465713)
    api.openweathermap.org/data/2.5/weather?q=conde
    
    Exception: aflu is not in OWM database.
    
    Retrieving weather data for kindu (212902)
    api.openweathermap.org/data/2.5/weather?q=kindu
    
    Retrieving weather data for milledgeville (4209448)
    api.openweathermap.org/data/2.5/weather?q=milledgeville
    
    Retrieving weather data for waipawa (2185329)
    api.openweathermap.org/data/2.5/weather?q=waipawa
    
    Retrieving weather data for vallenar (3868633)
    api.openweathermap.org/data/2.5/weather?q=vallenar
    
    Retrieving weather data for kwinana (2068079)
    api.openweathermap.org/data/2.5/weather?q=kwinana
    
    Retrieving weather data for havre-saint-pierre (5972291)
    api.openweathermap.org/data/2.5/weather?q=havre-saint-pierre
    
    Retrieving weather data for urengoy (1488414)
    api.openweathermap.org/data/2.5/weather?q=urengoy
    
    Retrieving weather data for san angelo (5530022)
    api.openweathermap.org/data/2.5/weather?q=san angelo
    
    Retrieving weather data for linares (3883167)
    api.openweathermap.org/data/2.5/weather?q=linares
    
    Retrieving weather data for callaway (5024237)
    api.openweathermap.org/data/2.5/weather?q=callaway
    
    Retrieving weather data for khasan (2039557)
    api.openweathermap.org/data/2.5/weather?q=khasan
    
    Retrieving weather data for viedma (3832899)
    api.openweathermap.org/data/2.5/weather?q=viedma
    
    Retrieving weather data for constantine (2501152)
    api.openweathermap.org/data/2.5/weather?q=constantine
    
    Retrieving weather data for leninskoye (1510350)
    api.openweathermap.org/data/2.5/weather?q=leninskoye
    
    Retrieving weather data for severnoye (496381)
    api.openweathermap.org/data/2.5/weather?q=severnoye
    
    Retrieving weather data for mariakani (187661)
    api.openweathermap.org/data/2.5/weather?q=mariakani
    
    Retrieving weather data for anqiu (1817990)
    api.openweathermap.org/data/2.5/weather?q=anqiu
    
    Retrieving weather data for fitchburg (4936812)
    api.openweathermap.org/data/2.5/weather?q=fitchburg
    
    Retrieving weather data for chudniv (710381)
    api.openweathermap.org/data/2.5/weather?q=chudniv
    
    Exception: bolshiye kaybitsy is not in OWM database.
    
    Retrieving weather data for basoko (219414)
    api.openweathermap.org/data/2.5/weather?q=basoko
    
    Retrieving weather data for san sebastian (1688440)
    api.openweathermap.org/data/2.5/weather?q=san sebastian
    
    Retrieving weather data for broken hill (2173911)
    api.openweathermap.org/data/2.5/weather?q=broken hill
    
    Retrieving weather data for nizhniy baskunchak (520798)
    api.openweathermap.org/data/2.5/weather?q=nizhniy baskunchak
    
    Exception: paradwip is not in OWM database.
    
    Retrieving weather data for priargunsk (2017646)
    api.openweathermap.org/data/2.5/weather?q=priargunsk
    
    Retrieving weather data for tiznit (2527089)
    api.openweathermap.org/data/2.5/weather?q=tiznit
    
    Retrieving weather data for honiara (2108502)
    api.openweathermap.org/data/2.5/weather?q=honiara
    
    Retrieving weather data for oranjemund (3354071)
    api.openweathermap.org/data/2.5/weather?q=oranjemund
    
    Retrieving weather data for manaus (3663517)
    api.openweathermap.org/data/2.5/weather?q=manaus
    
    Retrieving weather data for uvira (204405)
    api.openweathermap.org/data/2.5/weather?q=uvira
    
    Retrieving weather data for noumea (2139521)
    api.openweathermap.org/data/2.5/weather?q=noumea
    
    Exception: guajara-mirim is not in OWM database.
    
    Retrieving weather data for sokoto (2322911)
    api.openweathermap.org/data/2.5/weather?q=sokoto
    
    Retrieving weather data for bracebridge (5907092)
    api.openweathermap.org/data/2.5/weather?q=bracebridge
    
    Retrieving weather data for charters towers (2171722)
    api.openweathermap.org/data/2.5/weather?q=charters towers
    
    Retrieving weather data for velyka lepetykha (690247)
    api.openweathermap.org/data/2.5/weather?q=velyka lepetykha
    
    Retrieving weather data for darnah (87205)
    api.openweathermap.org/data/2.5/weather?q=darnah
    
    Retrieving weather data for raymond (5091636)
    api.openweathermap.org/data/2.5/weather?q=raymond
    
    Retrieving weather data for auki (2339937)
    api.openweathermap.org/data/2.5/weather?q=auki
    
    Retrieving weather data for berlevag (780687)
    api.openweathermap.org/data/2.5/weather?q=berlevag
    
    Exception: irbil is not in OWM database.
    
    Retrieving weather data for teguldet (1489822)
    api.openweathermap.org/data/2.5/weather?q=teguldet
    
    Retrieving weather data for scarborough (2638419)
    api.openweathermap.org/data/2.5/weather?q=scarborough
    
    Exception: samalaeulu is not in OWM database.
    
    Retrieving weather data for farafangana (1065158)
    api.openweathermap.org/data/2.5/weather?q=farafangana
    
    Retrieving weather data for goderich (5962442)
    api.openweathermap.org/data/2.5/weather?q=goderich
    
    Retrieving weather data for mariental (2873499)
    api.openweathermap.org/data/2.5/weather?q=mariental
    
    Retrieving weather data for mitsamiouli (921786)
    api.openweathermap.org/data/2.5/weather?q=mitsamiouli
    
    Retrieving weather data for sepuka (150099)
    api.openweathermap.org/data/2.5/weather?q=sepuka
    
    Retrieving weather data for puerto escondido (3520994)
    api.openweathermap.org/data/2.5/weather?q=puerto escondido
    
    Retrieving weather data for shenjiamen (1795632)
    api.openweathermap.org/data/2.5/weather?q=shenjiamen
    
    Exception: uralskiy is not in OWM database.
    
    Retrieving weather data for iquique (3887127)
    api.openweathermap.org/data/2.5/weather?q=iquique
    
    Retrieving weather data for kalmunai (1242110)
    api.openweathermap.org/data/2.5/weather?q=kalmunai
    
    Retrieving weather data for maragogi (3395458)
    api.openweathermap.org/data/2.5/weather?q=maragogi
    
    Retrieving weather data for dromolaxia (146400)
    api.openweathermap.org/data/2.5/weather?q=dromolaxia
    
    Retrieving weather data for greensburg (4326511)
    api.openweathermap.org/data/2.5/weather?q=greensburg
    
    Retrieving weather data for kharp (1503726)
    api.openweathermap.org/data/2.5/weather?q=kharp
    
    Retrieving weather data for kovrov (543460)
    api.openweathermap.org/data/2.5/weather?q=kovrov
    
    Retrieving weather data for pangkalanbuun (1632694)
    api.openweathermap.org/data/2.5/weather?q=pangkalanbuun
    
    Retrieving weather data for bereda (3105522)
    api.openweathermap.org/data/2.5/weather?q=bereda
    
    Retrieving weather data for barreiras (3470583)
    api.openweathermap.org/data/2.5/weather?q=barreiras
    
    Retrieving weather data for jacksonville (4160021)
    api.openweathermap.org/data/2.5/weather?q=jacksonville
    
    Retrieving weather data for domat (2661001)
    api.openweathermap.org/data/2.5/weather?q=domat
    
    Retrieving weather data for ust-uda (2013865)
    api.openweathermap.org/data/2.5/weather?q=ust-uda
    
    Retrieving weather data for santa maria (3450083)
    api.openweathermap.org/data/2.5/weather?q=santa maria
    
    Exception: kamenskoye is not in OWM database.
    
    Retrieving weather data for sangin (1127547)
    api.openweathermap.org/data/2.5/weather?q=sangin
    
    Retrieving weather data for arcata (5558953)
    api.openweathermap.org/data/2.5/weather?q=arcata
    
    Retrieving weather data for belaya gora (2126785)
    api.openweathermap.org/data/2.5/weather?q=belaya gora
    
    Retrieving weather data for oktyabrskiy (515873)
    api.openweathermap.org/data/2.5/weather?q=oktyabrskiy
    
    Retrieving weather data for nang rong (1608424)
    api.openweathermap.org/data/2.5/weather?q=nang rong
    
    Retrieving weather data for abha (110690)
    api.openweathermap.org/data/2.5/weather?q=abha
    
    Retrieving weather data for gawler (2071059)
    api.openweathermap.org/data/2.5/weather?q=gawler
    
    Exception: skalistyy is not in OWM database.
    
    Exception: bac can is not in OWM database.
    
    Retrieving weather data for biak (1637001)
    api.openweathermap.org/data/2.5/weather?q=biak
    
    Retrieving weather data for moerai (4034188)
    api.openweathermap.org/data/2.5/weather?q=moerai
    
    Retrieving weather data for bima (1648759)
    api.openweathermap.org/data/2.5/weather?q=bima
    
    Retrieving weather data for beyneu (610298)
    api.openweathermap.org/data/2.5/weather?q=beyneu
    
    Retrieving weather data for rincon (4218882)
    api.openweathermap.org/data/2.5/weather?q=rincon
    
    Retrieving weather data for aguascalientes (4019233)
    api.openweathermap.org/data/2.5/weather?q=aguascalientes
    
    Retrieving weather data for blythe (5329649)
    api.openweathermap.org/data/2.5/weather?q=blythe
    
    Retrieving weather data for xuddur (49747)
    api.openweathermap.org/data/2.5/weather?q=xuddur
    
    Retrieving weather data for gamboula (2386756)
    api.openweathermap.org/data/2.5/weather?q=gamboula
    
    Retrieving weather data for vilhena (3924679)
    api.openweathermap.org/data/2.5/weather?q=vilhena
    
    Retrieving weather data for puerto asis (3671549)
    api.openweathermap.org/data/2.5/weather?q=puerto asis
    
    Retrieving weather data for anloga (2304548)
    api.openweathermap.org/data/2.5/weather?q=anloga
    
    Retrieving weather data for kenai (5866063)
    api.openweathermap.org/data/2.5/weather?q=kenai
    
    Retrieving weather data for micheldorf (7872772)
    api.openweathermap.org/data/2.5/weather?q=micheldorf
    
    Retrieving weather data for ambon (3037899)
    api.openweathermap.org/data/2.5/weather?q=ambon
    
    Retrieving weather data for lithgow (2160053)
    api.openweathermap.org/data/2.5/weather?q=lithgow
    
    Exception: solsvik is not in OWM database.
    
    Retrieving weather data for bollnas (2720679)
    api.openweathermap.org/data/2.5/weather?q=bollnas
    
    Exception: chokwe is not in OWM database.
    
    Exception: maloshuyka is not in OWM database.
    
    Retrieving weather data for axim (2303611)
    api.openweathermap.org/data/2.5/weather?q=axim
    
    Retrieving weather data for santiago del estero (3835869)
    api.openweathermap.org/data/2.5/weather?q=santiago del estero
    
    Retrieving weather data for dingle (1714733)
    api.openweathermap.org/data/2.5/weather?q=dingle
    
    Retrieving weather data for mollendo (3934707)
    api.openweathermap.org/data/2.5/weather?q=mollendo
    
    Exception: tahta is not in OWM database.
    
    Retrieving weather data for tamandare (3661980)
    api.openweathermap.org/data/2.5/weather?q=tamandare
    
    Exception: bargal is not in OWM database.
    
    Exception: chagda is not in OWM database.
    
    Retrieving weather data for cayenne (3382160)
    api.openweathermap.org/data/2.5/weather?q=cayenne
    
    Exception: bardiyah is not in OWM database.
    
    Retrieving weather data for la tuque (6050416)
    api.openweathermap.org/data/2.5/weather?q=la tuque
    
    Exception: olafsvik is not in OWM database.
    
    Retrieving weather data for shache (1280037)
    api.openweathermap.org/data/2.5/weather?q=shache
    
    Retrieving weather data for kalabo (915471)
    api.openweathermap.org/data/2.5/weather?q=kalabo
    
    Retrieving weather data for nuuk (3421319)
    api.openweathermap.org/data/2.5/weather?q=nuuk
    
    Retrieving weather data for muzhi (1498161)
    api.openweathermap.org/data/2.5/weather?q=muzhi
    
    Retrieving weather data for fare (4034496)
    api.openweathermap.org/data/2.5/weather?q=fare
    
    Retrieving weather data for ajdabiya (89113)
    api.openweathermap.org/data/2.5/weather?q=ajdabiya
    
    Retrieving weather data for novomalorossiyskaya (518621)
    api.openweathermap.org/data/2.5/weather?q=novomalorossiyskaya
    
    Retrieving weather data for bulawayo (894701)
    api.openweathermap.org/data/2.5/weather?q=bulawayo
    
    Retrieving weather data for balkanabat (161616)
    api.openweathermap.org/data/2.5/weather?q=balkanabat
    
    Retrieving weather data for ridgecrest (5387494)
    api.openweathermap.org/data/2.5/weather?q=ridgecrest
    
    Retrieving weather data for sioux lookout (6148373)
    api.openweathermap.org/data/2.5/weather?q=sioux lookout
    
    Retrieving weather data for elbistan (315795)
    api.openweathermap.org/data/2.5/weather?q=elbistan
    
    Retrieving weather data for porbandar (1259395)
    api.openweathermap.org/data/2.5/weather?q=porbandar
    
    Retrieving weather data for davila (1715335)
    api.openweathermap.org/data/2.5/weather?q=davila
    
    Retrieving weather data for sassandra (2281951)
    api.openweathermap.org/data/2.5/weather?q=sassandra
    
    


```python
# last check to make sure n>=500
len(city_data)
```




    679




```python
# Save the data to a csv file
with open('city_data.json', 'w') as outfile:
    json.dump(city_data, outfile, sort_keys=True, indent=4)
```


```python
# create a dataframe from the dataset collected from OWM
humidity = [city['main']['humidity'] for city in city_data]
ws = [city['wind']['speed'] for city in city_data]
country = [city['sys']['country'] for city in city_data]
longitude = [city['coord']['lon'] for city in city_data]
latitude = [city['coord']['lat'] for city in city_data]
temperature = [city['main']['temp'] for city in city_data]
cloudiness = [city['clouds']['all'] for city in city_data]
city = [city['name'] for city in city_data]

final_cities_df = pd.DataFrame({
    'Name': city,
    'Country': country,
    'Latitude': latitude,
    'Longitude': longitude,
    'Temperature': temperature,
    'Humidity': humidity,
    "% Cloudiness": cloudiness,
    'Wind Speed': ws
})

final_cities_df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>% Cloudiness</th>
      <th>Country</th>
      <th>Humidity</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Name</th>
      <th>Temperature</th>
      <th>Wind Speed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>20</td>
      <td>MX</td>
      <td>9</td>
      <td>24.01</td>
      <td>-104.61</td>
      <td>Paraiso</td>
      <td>87.80</td>
      <td>11.41</td>
    </tr>
    <tr>
      <th>1</th>
      <td>20</td>
      <td>PF</td>
      <td>100</td>
      <td>-9.80</td>
      <td>-139.03</td>
      <td>Atuona</td>
      <td>79.30</td>
      <td>18.37</td>
    </tr>
    <tr>
      <th>2</th>
      <td>88</td>
      <td>NZ</td>
      <td>90</td>
      <td>-46.19</td>
      <td>168.86</td>
      <td>Mataura</td>
      <td>37.26</td>
      <td>11.21</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0</td>
      <td>MX</td>
      <td>69</td>
      <td>27.97</td>
      <td>-114.04</td>
      <td>Guerrero Negro</td>
      <td>70.56</td>
      <td>5.95</td>
    </tr>
    <tr>
      <th>4</th>
      <td>90</td>
      <td>CA</td>
      <td>82</td>
      <td>45.36</td>
      <td>-73.48</td>
      <td>Saint-Philippe</td>
      <td>58.37</td>
      <td>11.41</td>
    </tr>
  </tbody>
</table>
</div>




```python
# minor data clean up for presentable dataframe
final_cities_df = final_cities_df[["Name", 'Country', 'Latitude', 'Longitude', "Temperature", 'Humidity', "Wind Speed", 
                                 '% Cloudiness']]
final_cities_df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Name</th>
      <th>Country</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Temperature</th>
      <th>Humidity</th>
      <th>Wind Speed</th>
      <th>% Cloudiness</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Paraiso</td>
      <td>MX</td>
      <td>24.01</td>
      <td>-104.61</td>
      <td>87.80</td>
      <td>9</td>
      <td>11.41</td>
      <td>20</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Atuona</td>
      <td>PF</td>
      <td>-9.80</td>
      <td>-139.03</td>
      <td>79.30</td>
      <td>100</td>
      <td>18.37</td>
      <td>20</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Mataura</td>
      <td>NZ</td>
      <td>-46.19</td>
      <td>168.86</td>
      <td>37.26</td>
      <td>90</td>
      <td>11.21</td>
      <td>88</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Guerrero Negro</td>
      <td>MX</td>
      <td>27.97</td>
      <td>-114.04</td>
      <td>70.56</td>
      <td>69</td>
      <td>5.95</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Saint-Philippe</td>
      <td>CA</td>
      <td>45.36</td>
      <td>-73.48</td>
      <td>58.37</td>
      <td>82</td>
      <td>11.41</td>
      <td>90</td>
    </tr>
  </tbody>
</table>
</div>




```python
#Create scatter plot for latitude vs temperature
sb.lmplot("Latitude", "Temperature", final_cities_df, scatter=True, order=2)
plt.title("Temperature vs Latitude (June 5, 2018)")
plt.axvline(x=0, c='g', linestyle='dashed')
plt.savefig('temp_v_lat.png', bbox_inches='tight')
plt.show()
```


![png](output_16_0.png)



```python
#Create scatter plot for latitude vs humidity
sb.lmplot("Latitude", "Humidity", final_cities_df, scatter=True, order=2)
plt.title("Humidity vs Latitude (June 5, 2018)")
plt.axvline(x=0, c='g', linestyle='dashed')
plt.savefig('humidity_v_lat.png', bbox_inches='tight')
plt.show()
```


![png](output_17_0.png)



```python
#Create scatter plot for latitude vs wind speed
sb.lmplot("Latitude", "Wind Speed", final_cities_df, scatter=True, order=2)
plt.title("Wind Speed vs Latitude (June 5, 2018)")
plt.ylim(0,40)
plt.axvline(x=0, c='g', linestyle='dashed')
plt.savefig('ws_v_lat.png', bbox_inches='tight')
plt.show()
```


![png](output_18_0.png)



```python
#Create scatter plot for latitude vs cloudiness
sb.lmplot("Latitude", "% Cloudiness", final_cities_df, scatter=True, order=2)
plt.title("Cloudiness vs Latitude (June 5, 2018)")
plt.axvline(x=0, c='g', linestyle='dashed')
plt.savefig('cloud_v_lat.png', bbox_inches='tight')
plt.show()
```


![png](output_19_0.png)


# import dependencies
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import time
import requests

def scrape():

    mars_data = {}

    # create path and set up browser
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)



    # scrape the latest news from the NASA Mars site
    nasa_url = 'https://mars.nasa.gov/news'
    browser.visit(nasa_url)

    nasa_html = browser.html
    nasa_soup = BeautifulSoup(nasa_html, 'html.parser')
    title_results = nasa_soup.find_all('div', class_='content_title')
    paragraph_results = nasa_soup.find_all('div', class_='article_teaser_body')
    mars_data['nasa_title'] = title_results[0].text
    mars_data['nasa_paragraph'] = paragraph_results[0].text


    # grab the featured image from JPL website
    jpl_url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(jpl_url)
    browser.click_link_by_partial_text('FULL IMAGE')
    browser.is_element_not_present_by_text('more info', wait_time=5)
    browser.click_link_by_partial_text('more info')
    jpl_html = browser.html
    jpl_soup = BeautifulSoup(jpl_html, 'html.parser')
    mars_data["featured_image_url"] = 'https:' + jpl_soup.find_all('div', class_='download_tiff')[1].a['href']

    # scrape the latest weather update from Mars weather twitter account
    twitter_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(twitter_url)
    twitter_html = browser.html
    twitter_soup = BeautifulSoup(twitter_html, 'html.parser')
    mars_weather_tweets = twitter_soup.find_all('div', class_= 'js-tweet-text-container')

    temps = []
    for x in range(20):
        check = mars_weather_tweets[x].p.text[:3] != 'Sol'
        if check == False:
            tweet = mars_weather_tweets[x].p.text
            temps.append(tweet)
    
    mars_data['weather'] = temps[0]

    # use pandas to scrape tabular data from Mars Facts
    facts_url = 'https://space-facts.com/mars/'
    mars_table = pd.read_html(facts_url)
    mars_df = mars_table[0]
    mars_df.columns = ['Description', 'Value']
    mars_df.set_index('Description', inplace=True)
    mars_html_table = mars_df.to_html(classes=["table-bordered", "table-striped"])
    mars_data['table'] = mars_html_table


    # scrape the mars hemispher images
    usgs_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    usgs_response = requests.get(usgs_url)
    usgs_soup = BeautifulSoup(usgs_response.text, 'html.parser')
    pages = usgs_soup.find_all('a', class_="itemLink product-item")

    urls = []
    for page in pages:
        partial_url = page['href']
        full_url = "https://astrogeology.usgs.gov" + partial_url
        urls.append(full_url)


    hemisphere_image_urls = []
    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        image = soup.find('img', class_='wide-image')['src']
        image_url = 'https://astrogeology.usgs.gov' + image
        title = soup.find('h2', class_='title').text
        
        mars_dict = {"title": title,
                "img_url": image_url}
        hemisphere_image_urls.append(mars_dict)
    mars_data['hemispheres'] = hemisphere_image_urls

    return mars_data


import urllib.request
from socket import timeout
from urllib.request import Request, urlopen

# import requests
# r = requests.get("http://example.com/foo/bar")
req = Request('https://www.yt-download.org/@api/button/mp3/KlpasSh-nqY', headers={'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest'})
r = urllib.request.urlopen(req).read().decode('utf-8')
req = Request('https://www.yt-download.org/@grab?vidID=KlpasSh-nqY&format=mp3&streams=mp3&api=button', headers={'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest', 'referer': 'https://www.yt-download.org/@api/button/mp3/62Y7BXIuX6Y'})

r = urllib.request.urlopen(req).read().decode('utf-8')

# print(r)


req = Request('https://www.yt-download.org/@download/64-59e6aba72b0ca-944000/mp3/KlpasSh-nqY/2017%2BKetDoan%2BCamp%2BTeam%2BAdvisers.mp3', headers={'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest'})

audio = urllib.request.urlopen(req).read()

print(audio)

f=open('python.mp3', 'wb')


f.write(audio)
    
f.close()
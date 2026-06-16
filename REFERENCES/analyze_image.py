import urllib.request, io
from PIL import Image

url = "https://static.wixstatic.com/media/c5862a_82dd0c4786464a949e1a521eabd2853f~mv2.png/v1/fill/w_594,h_554,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Title%20(80).png"

# We must accept avif if we pass that URL, but PIL doesn't support avif natively easily. Let's request PNG.
url = "https://static.wixstatic.com/media/c5862a_82dd0c4786464a949e1a521eabd2853f~mv2.png/v1/fill/w_594,h_554,al_c,q_85,usm_0.66_1.00_0.01/Title%20(80).png"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req)
img = Image.open(io.BytesIO(resp.read())).convert('RGB')
w, h = img.size

# Find all pink pixels (specifically the dot centers which are solid pink #ec028b -> rgb(236,2,139))
dots = []
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))
        # The true pink is ~236, 2, 139
        if r > 200 and g < 50 and b > 100:
            # group into clusters 
            found_cluster = False
            for d in dots:
                cx, cy, count = d
                if abs(cx/count - x) < 20 and abs(cy/count - y) < 20:
                    d[0] += x
                    d[1] += y
                    d[2] += 1
                    found_cluster = True
                    break
            if not found_cluster:
                dots.append([x, y, 1])

# print clusters
print(f"Found {len(dots)} pink dot clusters:")
for d in dots:
    cx = d[0]/d[2]
    cy = d[1]/d[2]
    print(f"X: {cx/w*100:.2f}%, Y: {cy/h*100:.2f}% (Count: {d[2]})")

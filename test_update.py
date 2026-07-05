import requests

# 1. Login to get token
r = requests.post('http://localhost:8000/api/v1/auth/login', data={'username':'admin', 'password':'admin123'})
token = r.json().get('access_token')
headers = {'Authorization': f'Bearer {token}'}

# 2. Get first project
r2 = requests.get('http://localhost:8000/api/v1/portfolio/projects')
projects = r2.json()
p = projects[0]
print('Before update tech_stack:', p.get('tech_stack'))

# 3. Upload a media file
with open('test_image.png', 'rb') as f:
    files = {'file': f}
    r3 = requests.post('http://localhost:8000/api/v1/admin/media/upload', headers=headers, files=files)
media = r3.json()
print('Upload response:', media)

# 4. Update the project with the new image URL
url = 'http://localhost:8000' + media.get('url', '')
p['preview_image_url'] = url
r4 = requests.put(f'http://localhost:8000/api/v1/admin/projects/{p["id"]}', headers=headers, json=p)
print('Update response status:', r4.status_code)
print('Update response JSON:', r4.json())

# 5. Get project again to see tech_stack
r5 = requests.get('http://localhost:8000/api/v1/portfolio/projects')
p_after = r5.json()[0]
print('After update tech_stack:', p_after.get('tech_stack'))

import requests
import json

# 1. Login
r = requests.post('http://localhost:8000/api/v1/auth/login', data={'username':'admin', 'password':'admin123'})
token = r.json().get('access_token')
headers = {'Authorization': f'Bearer {token}'}

# 2. Get projects
projects = requests.get('http://localhost:8000/api/v1/portfolio/projects').json()
p = projects[0]

# 3. Simulate what React sends exactly (using json.dumps to see what axios sends)
# React sends:
payload = {
    'title': p['title'],
    'description': p['description'],
    'tech_stack': p['tech_stack'],
    'preview_image_url': 'http://localhost:8000/uploads/fake.png',
    'github_url': p.get('github_url') or '',
    'demo_url': p.get('demo_url') or '',
    'features': p.get('features') or [],
    'is_featured': p['is_featured'],
    'display_order': p['display_order']
}

print('Payload being sent:', payload)

r_update = requests.put(f'http://localhost:8000/api/v1/admin/projects/{p["id"]}', headers=headers, json=payload)
print('Update status:', r_update.status_code)
print('Update response:', r_update.json())

# 4. Fetch projects again
p_after = requests.get('http://localhost:8000/api/v1/portfolio/projects').json()[0]
print('After update:', p_after)

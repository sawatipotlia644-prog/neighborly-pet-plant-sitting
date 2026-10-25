# Neighborly — Pet & Plant Sitting

Neighborly is a mobile-first single-page web app for finding nearby neighbors who can help with pet care, plant watering, and home check-ins while someone is away.

## Features

- Friendly community board with category filters for pet care, plant care, and home check-ins
- Modal request form with validation for required fields and safe browser-only persistence
- Quick response flow for a request card that pre-fills the form for follow-up
- LocalStorage-backed state so request cards persist across refreshes in the same browser
- Mobile-first responsive layout with a warm, welcoming community aesthetic
- Toast confirmation after posting a request

## Run it locally

1. Open the project folder.
2. Start a simple local server in the terminal:

```bash
cd /path/to/project
python3 -m http.server 8000
```

3. Visit http://localhost:8000 in your browser.

## Deploy with Netlify

1. Push the project to GitHub.
2. Sign in to Netlify.
3. Choose "Add new project" and connect the repository.
4. Set the publish directory to the project root.
5. Leave the build step blank for this plain static site.
6. Deploy.

## Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository settings.
3. Select the Pages section.
4. Choose the main branch and root folder.
5. Save the settings to publish the page.

## Notes

- This is a front-end demo only and does not connect to a backend or real user accounts.
- All posted request data stays in the current browser via localStorage for demo purposes.

Live deployed URL: https://your-live-demo-url.example
GitHub repository URL: https://github.com/your-username/your-repo


## Week 3–4 design deliverables

- **Lo-fi prototype:** https://sawatipotlia644-prog.github.io/neighborly-pet-plant-sitting/prototype/
- **Interactive concept build:** https://sawatipotlia644-prog.github.io/neighborly-pet-plant-sitting/build/
- **Source code repository:** https://github.com/sawatipotlia644-prog/neighborly-pet-plant-sitting

### Design rationale to validate against research
The Week 3–4 interview notes and context-mapping artifacts were not provided in this conversation, so these are explicitly working hypotheses inferred from the existing Neighborly pet-and-plant-care concept—not direct interview findings:

1. People should be able to scan care requests by category.
2. A request should show task, timing, and approximate duration before someone offers help.
3. Posting a request should be short and guided.
4. Trust and clear care instructions matter when asking a neighbour to look after a pet, plant, or home.
5. The product should support both people requesting help and people offering it.

### How the prototype informs the build
- Category filters in the wireframe became working filter chips.
- Request-list cards became responsive cards with a details dialog.
- The request form became a validated preview flow that adds a request to the current page.
- The trust/safety notes remain visible before users commit to helping.
- Both pages adapt to mobile screens.

### Limitations
This is a front-end concept build only. Sample requests are illustrative. New requests exist only in the current page session; there is no backend, account system, messaging, or server-side storage. The “I'm interested” action demonstrates a future flow and does not contact anyone. Please compare the working hypotheses with your actual interview and context-mapping findings before submitting.

# Neighborly — Pet & Plant Sitting

Neighborly is a community website for finding nearby help with pet sitting, plant watering, and home check-ins while someone is away. This project is a static front-end demo built with HTML, CSS, and JavaScript.

## Features

- Warm, welcoming landing page inspired by the lo-fi prototype
- Responsive request board with category filters and live search
- Request detail modal with a neighbor-friendly summary and confirmation flow
- Request form with validation for required fields and date ordering
- Browser-based storage for demo requests
- Trust and safety guidance to help neighbors coordinate respectfully
- Responsive layouts for desktop and mobile

## Run Locally

1. Open the project folder in VS Code.
2. Open a terminal in the project folder.
3. Start a local server:

   ```bash
   python3 -m http.server 8000
   ```

4. Open http://localhost:8000 in your browser.

## Browser Demo Notes

- Where implemented, requests are saved in the current browser's `localStorage`.
- This is a front-end demo, not a shared online database or real messaging system.
- Browser-stored requests are not automatically visible to other users.

## Week 3–4 Design Deliverables

- **Lo-fi prototype:** https://sawatipotlia644-prog.github.io/neighborly-pet-plant-sitting/prototype/
- **Interactive concept build:** https://sawatipotlia644-prog.github.io/neighborly-pet-plant-sitting/build/
- **Source code repository:** https://github.com/sawatipotlia644-prog/neighborly-pet-plant-sitting
- **Main website:** https://sawatipotlia644-prog.github.io/neighborly-pet-plant-sitting/

## Design Rationale to Validate Against Research

The interview notes and context-mapping artifacts were not included here. The following points are working hypotheses based on the Neighborly concept, not verified interview findings:

1. People should be able to scan care requests by category.
2. A request should show the task, timing, and approximate duration before someone offers help.
3. Posting a request should be short and guided.
4. Trust and clear care instructions matter when asking a neighbor to look after a pet, plant, or home.
5. The product should support both people requesting help and people offering it.

Compare these hypotheses with your actual interview and context-mapping findings before submitting.

## How the Prototype Informs the Build

- Category filters in the wireframe inform the request filtering interface.
- Request-list cards inform the responsive cards and details dialog.
- The request form informs the validated request-submission flow.
- Trust and safety notes remain visible to help users coordinate responsibly.
- The prototype and concept build are designed to adapt to mobile screens.

## Accessibility and Responsive Design

- Navigation supports desktop and mobile layouts.
- Form fields and buttons are designed for keyboard access.
- The modal is intended to support clear labels and accessible closing behavior.
- A soft neutral and green palette supports a welcoming visual style.

## Limitations

- No backend or authentication is implemented.
- The website does not provide actual identity verification or real-time messaging.
- Browser storage is limited to the current browser and device.
- Sample requests are illustrative.
- The “I'm interested” action demonstrates a possible future flow and does not contact anyone.


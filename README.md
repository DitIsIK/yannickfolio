# Yannickfolio Content Guide

Dit project bevat de persoonlijke portfolio van Yannick Deetman. De content is gecentraliseerd zodat copy en assets eenvoudig aangepast kunnen worden.

## Inhoud aanpassen

- **Tekst & links:** bewerk `frontend/src/data/site.js`. Dit bestand bevat alle hero-tekst, bio, skills, projecten, feed-items en contactgegevens.
- **Projectcovers & meta-afbeeldingen:** vervang de SVG-bestanden in `frontend/public/projects/` en `frontend/public/assets/meta/` door eigen visuals met dezelfde bestandsnamen.
- **Profielfoto & CV:** update `frontend/public/assets/profile/` en `frontend/public/assets/cv/`. De CV-placeholder is een tekstbestand met de extensie `.pdf` zodat er geen binair bestand nodig is.
- **Icons:** eventuele nieuwe skill-iconen kun je toevoegen in `frontend/src/assets/img/icons/` en registreren in `frontend/src/services/icons.js`.

## Build & ontwikkeling

Ga naar de `frontend` map en gebruik de bestaande scripts:

```bash
cd frontend
npm install
npm run start   # start lokale ontwikkelserver
npm run build   # bouwt productieversie
```

Veel plezier met het uitbreiden van de portfolio!

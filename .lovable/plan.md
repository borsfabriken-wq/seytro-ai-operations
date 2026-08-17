# Lunchpasset med samma tidsinställningar

Panelen Tidsinställningar finns redan och öppnas för valfritt pass, men lunchpasset har andra värden än referensen och passlistan saknar frukostpasset som referensens chips visar.

## Vad som ändras

1. **Lunch enligt referensen**
   - Tidsperiod 10:30–16:30, standardtid 12:00.
   - Alla sju veckodagar aktiva (i dag mån–fre).
   - Summering 10:30–16:00 (separat från tidsperioden, precis som i bilden).

2. **Frukostpass som standard**
   - Nytt pass Frukost 06:00–10:30, standardtid 08:00, alla dagar, ikon frukost — så att chipsraden visar tre tidsspann att växla mellan (06:00–10:30, 10:30–16:30, 16:15–00:00) som i referensen.

3. **Middag justeras till samma rytm**
   - Tidsperiod 16:15–00:00 så att passen ligger kant i kant utan glapp mot lunch.

4. **Konsekvenser i övrigt**
   - Dagsraderna i onboarding/konfiguration visar de nya tiderna automatiskt.
   - Snabbtiderna i bokningsdialogen följer passen och uppdateras därmed också.
   - Befintliga sparade uppsättningar rörs inte — bara nya/standarduppsättningar får de nya värdena.

## Tekniskt

- `src/lib/onboarding.ts`: uppdatera `defaultPeriods()` med tre pass (Frukost, Lunch, Middag) och de nya tiderna/summeringsintervallen; samma värden i migreringsfallbacken.
- Ingen ändring i `ServicePeriodPanel.tsx` behövs — den hanterar redan alla fält per pass.
- Verifiering: öppna lunchpasset i både onboarding och Konfiguration → Öppettider och kontrollera fälten mot referensen.

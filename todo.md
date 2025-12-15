# Hypertrophy Tracker - TODO

## ✅ Completed Features

### Core System
- [x] Database schema for workout plan and progress tracking
- [x] tRPC routers for workout plan and progress
- [x] User authentication with Manus OAuth
- [x] Responsive design for mobile use in the gym
- [x] Seed data with 5-day hypertrophy plan (Push-Pull-Legs-Upper-Lower)

### Workout Tracking
- [x] Home page with workout plan overview
- [x] Workout day detail page with exercise list
- [x] Progress tracking form (sets, reps, weight)
- [x] Progress history visualization
- [x] Rest timer in workout day page with presets (60s, 90s, 120s)

### Nutrition & Supplementation
- [x] Supplementation and nutrition page with protocol for 6-7 PM training
- [x] Meal tracking with macro goals (Protein: 167g, Carbs: 240g, Fats: 40g, Calories: 2600)
- [x] Daily macro progress bars
- [x] Meal entry form with macronutrient tracking

### Progress Analytics
- [x] Progress charts with Recharts (weight progression per exercise)
- [x] Volume tracking charts (total volume per exercise over time)
- [x] Exercise selector for individual progress visualization
- [x] Export workout data to CSV
- [x] Export workout data to PDF with jsPDF

### Supplement Reminders
- [x] Push notifications for supplement reminders
- [x] Supplement reminder configuration page
- [x] Individual toggle for each reminder (Creatina 7:30 AM, Citrulina 5:30 PM, Restore 11:00 PM)
- [x] Test notification functionality
- [x] LocalStorage persistence for reminder preferences
- [x] Browser notification permission handling

### Testing
- [x] Unit tests for authentication (auth.logout.test.ts)
- [x] Unit tests for progress tracking (progress.test.ts)
- [x] Database function coverage
- [x] Max weight and volume calculation validation

## 🚀 Future Enhancements (Optional)

### Analytics & Insights
- [ ] Weekly/monthly progress summary dashboard
- [ ] 1RM (one-rep max) prediction calculator
- [ ] Progress photos with side-by-side comparison
- [ ] Comparative charts between exercises
- [ ] Body weight tracking and trends

### Training Improvements
- [ ] Total workout duration timer
- [ ] Fatigue/RPE (Rate of Perceived Exertion) tracking per session
- [ ] Automatic progression suggestions
- [ ] Wearable integration (Garmin, Apple Watch)
- [ ] Video form check uploads

### Nutrition Enhancements
- [ ] Food database with search
- [ ] Barcode scanner for packaged foods
- [ ] Recipe builder with automatic macro calculation
- [ ] Meal planning calendar
- [ ] Water intake tracking

### Social Features
- [ ] Share progress with friends
- [ ] Leaderboards
- [ ] Training groups/communities
- [ ] Coach messaging system

### Technical Improvements
- [ ] PWA (Progressive Web App) for offline use
- [ ] Offline mode with sync
- [ ] Automatic cloud backup
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Voice input for logging sets

## 📌 Important Notes

### Training Schedule
- Training time: 6-7 PM on weekdays
- Tuesday: Classes until 7 PM (requires schedule adjustment)
- 5-day split: Push-Pull-Legs-Upper-Lower

### Supplementation Protocol
- **CRITICAL**: No caffeine after 5:30 PM (sleep interference)
- Creatine: 5g daily with breakfast (7:30 AM)
- Citrulline Malate: 6-8g 30-45 min pre-workout (5:30 PM)
- Omega-3: 3x daily with meals
- Isopure: 40g post-workout
- Restore: 1 cap 1 hour before sleep (11:00 PM)

### Daily Macros
- Protein: 167g (2.2g/kg × 76kg bodyweight)
- Carbohydrates: 240g
- Fats: 40g
- Total Calories: ~2600 kcal

### Progression Strategy
- RIR (Reps in Reserve): 1-2 for main lifts
- Increase weight when all sets completed at high end of rep range
- Focus areas: Legs, Chest, Arms, Back
- Calisthenics skills: Full Planche, Front Lever, HSPU progression


## 🔧 Bug Fixes / Improvements in Progress

- [x] Permitir registro de ejercicios individualmente (guardar progreso por ejercicio conforme se completa, no toda la sesión de una vez)
- [x] Historial de pesos anteriores: Mostrar el peso usado en la sesión anterior para cada ejercicio
- [x] Modo offline: Guardar datos localmente si se pierde conexión y sincronizar al reconectar
- [x] Notas por ejercicio: Campo para escribir notas personales en cada ejercicio

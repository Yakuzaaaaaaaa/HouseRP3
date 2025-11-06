# 🚗 Advanced CarHUD - FiveM

Zaawansowany, nowoczesny HUD dla pojazdów w FiveM z płynnymi animacjami i eleganckim designem.

## ✨ Funkcje

- 🎨 **Nowoczesny design** - Glassmorphism, gradienty i neonowe efekty
- ⚡ **Płynne animacje** - Wszystkie elementy są animowane
- 📊 **Kompletne informacje**:
  - Prędkościomierz z okrągłym wskaźnikiem (0-300 km/h)
  - Obrotomierz (RPM) z kolorowym paskiem
  - Wyświetlacz biegów (z biegiem wstecznym)
  - Paliwomierz z ostrzeżeniem przy niskim stanie
  - Pasek zdrowia pojazdu
  - Wskaźniki stanu (silnik, światła, pasy)
  - Nazwa pojazdu
- 🎯 **Responsywny** - Dostosowuje się do różnych rozdzielczości
- 🔧 **Konfigurowalne** - Łatwa konfiguracja w client.lua

## 📦 Instalacja

1. Skopiuj folder do swojego katalogu `resources`
2. Dodaj do `server.cfg`:
   ```
   ensure HouseRP3
   ```
3. Zrestartuj serwer

## 🎮 Użytkowanie

HUD automatycznie pojawia się gdy wsiadasz do pojazdu jako kierowca.

### Komendy

- `/togglehud` - Włącz/wyłącz HUD (do debugowania)

### Eventy

```lua
-- Ukryj HUD
TriggerEvent('carhud:hide')

-- Pokaż HUD
TriggerEvent('carhud:show')
```

## ⚙️ Konfiguracja

Edytuj plik `client/client.lua` aby dostosować ustawienia:

```lua
local Config = {
    updateInterval = 100,    -- Częstotliwość aktualizacji (ms)
    speedMultiplier = 3.6,   -- Konwersja prędkości (3.6 = km/h)
    maxSpeed = 300,          -- Maksymalna prędkość na wskaźniku
    fuelEnabled = true,      -- Włącz/wyłącz system paliwa
}
```

## 🎨 Dostosowywanie wyglądu

Style CSS znajdują się w `html/style.css`. Możesz łatwo zmieniać:
- Kolory (zmienne w CSS)
- Rozmiary elementów
- Pozycję HUD
- Efekty animacji

## 📁 Struktura plików

```
HouseRP3/
├── fxmanifest.lua       # Konfiguracja zasobu
├── client/
│   └── client.lua       # Logika klienta
└── html/
    ├── index.html       # Struktura HTML
    ├── style.css        # Style i animacje
    └── script.js        # Logika UI
```

## 🔧 Integracja z systemem paliwa

Jeśli używasz własnego systemu paliwa, zmodyfikuj funkcję `GetVehicleFuelLevel()` w `client.lua`:

```lua
function GetVehicleFuelLevel(vehicle)
    -- Przykład dla LegacyFuel
    -- return exports['LegacyFuel']:GetFuel(vehicle)

    -- Przykład dla innego systemu
    -- return exports['twoj-system']:GetFuel(vehicle)

    return GetVehicleFuelLevel(vehicle)
end
```

## 🎯 Wymagania

- FiveM Server
- Brak dodatkowych zależności

## 📝 Licencja

Ten projekt jest open-source i może być swobodnie używany i modyfikowany.

## 🤝 Wsparcie

Jeśli znajdziesz błędy lub masz sugestie, zgłoś je w Issues.

## 📸 Screenshots

HUD zawiera:
- Okrągły prędkościomierz z animowanym pierścieniem
- Pasek RPM z efektem świetlnym
- Duży wskaźnik biegu
- Paski paliwa i zdrowia pojazdu
- Wskaźniki stanu pojazdu
- Wyświetlacz nazwy pojazdu

---

Made with ❤️ for HouseRP

-- CarHUD Client Script
local isInVehicle = false
local hudActive = false
local previousVehicle = nil

-- Konfiguracja
local Config = {
    updateInterval = 100, -- Interwał aktualizacji w ms (100ms = 10 razy na sekundę)
    speedMultiplier = 3.6, -- Konwersja z m/s na km/h
    maxSpeed = 300, -- Maksymalna prędkość do wyświetlenia
    fuelEnabled = true, -- Czy włączyć system paliwa (jeśli masz system paliwa)
}

-- Funkcja do pobierania nazwy pojazdu
function GetVehicleDisplayName(vehicle)
    local displayName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))
    local text = GetLabelText(displayName)

    if text ~= "NULL" then
        return text
    else
        return displayName
    end
end

-- Funkcja do pobierania poziomu paliwa
function GetVehicleFuelLevel(vehicle)
    -- Jeśli używasz własnego systemu paliwa, możesz go tutaj zintegrować
    -- Przykład dla FiveM domyślnego systemu:
    if Config.fuelEnabled then
        -- Próba pobrania paliwa z różnych źródeł
        local fuel = GetVehicleFuelLevel(vehicle)

        -- Jeśli nie ma systemu paliwa, zwróć losową wartość lub 100
        if fuel <= 0 then
            return 100.0
        end

        return fuel
    end

    return 100.0 -- Domyślnie 100% jeśli system paliwa jest wyłączony
end

-- Funkcja do pobierania biegu
function GetVehicleCurrentGear(vehicle)
    local gear = GetVehicleCurrentGear(vehicle)

    -- Sprawdź czy jedzie na wstecznym
    local speed = GetEntitySpeed(vehicle)
    local velocity = GetEntityVelocity(vehicle)

    if velocity.y < 0 and speed > 0.1 then
        return 0 -- Bieg wsteczny
    end

    if gear == 0 then
        return "N" -- Neutralny
    end

    return gear
end

-- Funkcja do pobierania zdrowia pojazdu
function GetVehicleHealthPercent(vehicle)
    local health = GetVehicleEngineHealth(vehicle)
    local bodyHealth = GetVehicleBodyHealth(vehicle)

    -- Średnia zdrowia silnika i nadwozia
    local avgHealth = (health + bodyHealth) / 2

    -- Konwersja z zakresu 0-1000 do 0-100
    local percent = (avgHealth / 1000.0) * 100.0

    -- Ogranicz do zakresu 0-100
    if percent < 0 then percent = 0 end
    if percent > 100 then percent = 100 end

    return percent
end

-- Funkcja do sprawdzania czy światła są włączone
function AreVehicleLightsOn(vehicle)
    local lightsOn, highbeamsOn = GetVehicleLightsState(vehicle)
    return lightsOn == 1 or highbeamsOn == 1
end

-- Funkcja do aktualizacji HUD
function UpdateCarHUD()
    local player = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(player, false)

    -- Sprawdź czy gracz jest w pojeździe
    if vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == player then
        if not isInVehicle then
            isInVehicle = true
            previousVehicle = vehicle
        end

        -- Pobierz dane pojazdu
        local speed = GetEntitySpeed(vehicle) * Config.speedMultiplier
        local rpm = GetVehicleCurrentRpm(vehicle)
        local gear = GetVehicleCurrentGear(vehicle)
        local fuel = GetVehicleFuelLevel(vehicle)
        local health = GetVehicleHealthPercent(vehicle)
        local engineOn = GetIsVehicleEngineRunning(vehicle)
        local lightsOn = AreVehicleLightsOn(vehicle)
        local vehicleName = GetVehicleDisplayName(vehicle)

        -- Sprawdź bieg wsteczny
        if gear == 0 then
            gear = "N"
        else
            local velocity = GetEntityVelocity(vehicle)
            if velocity.y < 0 and speed > 0.1 then
                gear = 0 -- R dla wstecznego
            end
        end

        -- Wyślij dane do NUI
        SendNUIMessage({
            action = 'updateHud',
            show = true,
            speed = math.floor(speed),
            rpm = rpm,
            gear = gear,
            fuel = fuel,
            health = health,
            engine = engineOn,
            lights = lightsOn,
            belt = true, -- Możesz dodać własną logikę dla pasów
            vehicle = vehicleName
        })

        hudActive = true
    else
        -- Gracz nie jest w pojeździe
        if isInVehicle then
            isInVehicle = false
            hudActive = false

            -- Ukryj HUD
            SendNUIMessage({
                action = 'hideHud'
            })
        end
    end
end

-- Główna pętla
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(Config.updateInterval)
        UpdateCarHUD()
    end
end)

-- Event do ukrywania HUD (możesz wywołać z innych skryptów)
RegisterNetEvent('carhud:hide')
AddEventHandler('carhud:hide', function()
    SendNUIMessage({
        action = 'hideHud'
    })
    hudActive = false
end)

-- Event do pokazywania HUD (możesz wywołać z innych skryptów)
RegisterNetEvent('carhud:show')
AddEventHandler('carhud:show', function()
    SendNUIMessage({
        action = 'showHud'
    })
end)

-- Komenda do toggleowania HUD (do debugowania)
RegisterCommand('togglehud', function()
    if hudActive then
        SendNUIMessage({
            action = 'hideHud'
        })
        hudActive = false
        TriggerEvent('chat:addMessage', {
            color = {255, 0, 0},
            multiline = true,
            args = {"CarHUD", "HUD ukryty"}
        })
    else
        SendNUIMessage({
            action = 'showHud'
        })
        hudActive = true
        TriggerEvent('chat:addMessage', {
            color = {0, 255, 0},
            multiline = true,
            args = {"CarHUD", "HUD pokazany"}
        })
    end
end, false)

-- Info przy starcie zasobu
print("^2[CarHUD]^7 Zaawansowany CarHUD został załadowany!")
print("^2[CarHUD]^7 Użyj komendy /togglehud aby włączyć/wyłączyć HUD")
